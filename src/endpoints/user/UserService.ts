import { User, UserDocument } from "./UserModel";
import { TokenPayload } from "../authentication/AuthenticationService";
import { NotFoundError, ForbiddenError, ValidationError, rethrowAsValidationError } from "../../utils/Errors";

const SELF_EDITABLE = ["firstName", "lastName", "password"];
const ADMIN_EDITABLE = [...SELF_EDITABLE, "isAdministrator"];

// Antwort für /users: ohne Passwort
function toResponse(user: UserDocument) {
    return {
        id: user._id.toString(),
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdministrator: user.isAdministrator,
    };
}

// Antwort für /publicUsers: mit Passwort-Hash
function toPublicResponse(user: UserDocument) {
    return { ...toResponse(user), password: user.password };
}

function checkSelfOrAdmin(userID: string, requester: TokenPayload): void {
    if (!requester.isAdministrator && requester.userID !== userID) {
        throw new ForbiddenError("Not Authorized");
    }
}

async function findUserOrThrow(userID: string): Promise<UserDocument> {
    const user = await User.findOne({ userID });
    if (!user) {
        throw new NotFoundError(`Es konnte kein User mit der ID ${userID} gefunden werden.`);
    }
    return user;
}

function applyFields(user: UserDocument, data: Record<string, unknown>, allowedFields: string[]): void {
    for (const [key, value] of Object.entries(data)) {
        if (key === "userID" || key === "id") {
            continue;
        }
        if (!ADMIN_EDITABLE.includes(key)) {
            throw new ValidationError(`Unknown attribute: ${key}`);
        }
        if (!allowedFields.includes(key)) {
            throw new ForbiddenError(`Not allowed to change attribute: ${key}`);
        }
        user.set(key, value);
    }
}

async function saveNewUser(data: Record<string, unknown>): Promise<UserDocument> {
    const userID = data.userID;
    if (typeof userID !== "string" || userID.trim() === "") {
        throw new ValidationError("userID is required");
    }
    if (await User.exists({ userID })) {
        throw new ValidationError(`User ${userID} already exists`);
    }
    const user = new User({ userID });
    applyFields(user, data, ADMIN_EDITABLE);
    await user.save().catch(rethrowAsValidationError);
    return user;
}

async function saveUserChanges(
    userID: string,
    data: Record<string, unknown>,
    allowedFields: string[]
): Promise<UserDocument> {
    if (data.userID !== undefined && data.userID !== userID) {
        throw new ValidationError("The userID cannot be changed");
    }
    const user = await findUserOrThrow(userID);
    applyFields(user, data, allowedFields);
    await user.save().catch(rethrowAsValidationError);
    return user;
}

export async function ensureDefaultAdmin(): Promise<void> {
    if (!(await User.exists({ userID: "admin" }))) {
        await User.create({ userID: "admin", password: "123", isAdministrator: true });
        console.log("Default admin created");
    }
}

export async function deleteUser(userID: string): Promise<void> {
    const result = await User.deleteOne({ userID });
    if (result.deletedCount === 0) {
        throw new NotFoundError(`Es konnte kein User mit der ID ${userID} gefunden werden.`);
    }
}

// /publicUsers: ohne Authentifizierung

export async function getPublicUsers() {
    const users = await User.find();
    return users.map(toPublicResponse);
}

export async function getPublicUser(userID: string) {
    return toPublicResponse(await findUserOrThrow(userID));
}

export async function createPublicUser(data: Record<string, unknown>) {
    return toPublicResponse(await saveNewUser(data));
}

export async function updatePublicUser(userID: string, data: Record<string, unknown>) {
    return toPublicResponse(await saveUserChanges(userID, data, ADMIN_EDITABLE));
}

// /users: mit Authentifizierung und Autorisierung

export async function getUsers() {
    const users = await User.find();
    return users.map(toResponse);
}

export async function getUser(userID: string, requester: TokenPayload) {
    checkSelfOrAdmin(userID, requester);
    return toResponse(await findUserOrThrow(userID));
}

export async function createUser(data: Record<string, unknown>) {
    return toResponse(await saveNewUser(data));
}

export async function updateUser(userID: string, data: Record<string, unknown>, requester: TokenPayload) {
    checkSelfOrAdmin(userID, requester);
    const allowedFields = requester.isAdministrator ? ADMIN_EDITABLE : SELF_EDITABLE;
    return toResponse(await saveUserChanges(userID, data, allowedFields));
}