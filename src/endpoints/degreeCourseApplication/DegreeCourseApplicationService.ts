import mongoose, { HydratedDocument } from "mongoose";
import { DegreeCourse } from "../degreeCourse/DegreeCourseModel";
import { User } from "../user/UserModel";
import { TokenPayload } from "../authentication/AuthenticationService";
import { DegreeCourseApplication, IDegreeCourseApplication } from "./DegreeCourseApplicationModel";
import { ForbiddenError, NotFoundError, ValidationError, rethrowAsValidationError } from "../../utils/Errors";

type ApplicationDocument = HydratedDocument<IDegreeCourseApplication>;

const SELF_EDITABLE: string[] = ["degreeCourseID", "targetPeriodYear", "targetPeriodShortName"];
const ADMIN_EDITABLE: string[] = [...SELF_EDITABLE, "applicantUserID"];
const FILTERABLE: string[] = ["applicantUserID", "degreeCourseID"];

function toResponse(application: ApplicationDocument) {
    return {
        id: application._id.toString(),
        applicantUserID: application.applicantUserID,
        degreeCourseID: application.degreeCourseID,
        targetPeriodYear: application.targetPeriodYear,
        targetPeriodShortName: application.targetPeriodShortName,
    };
}

async function findOrThrow(id: string): Promise<ApplicationDocument> {
    const application = mongoose.isObjectIdOrHexString(id) ? await DegreeCourseApplication.findById(id) : null;
    if (!application) {
        throw new NotFoundError(`No degree course application found with id ${id}`);
    }
    return application;
}

function checkOwnerOrAdmin(application: ApplicationDocument, requester: TokenPayload): void {
    if (!requester.isAdministrator && application.applicantUserID !== requester.userID) {
        throw new ForbiddenError("Not Authorized");
    }
}

async function degreeCourseExists(id: unknown): Promise<boolean> {
    return typeof id === "string" && mongoose.isObjectIdOrHexString(id) && (await DegreeCourse.exists({ _id: id })) !== null;
}

async function ensureReferencesExist(application: ApplicationDocument, isNew: boolean): Promise<void> {
    if (isNew || application.isModified("degreeCourseID")) {
        if (!(await degreeCourseExists(application.degreeCourseID))) {
            throw new ValidationError("degreeCourseID is required and must reference an existing degree course");
        }
    }
    if (isNew || application.isModified("applicantUserID")) {
        if (!(await User.exists({ userID: application.applicantUserID }))) {
            throw new ValidationError("applicantUserID must reference an existing user");
        }
    }
}

function applyFields(
    application: ApplicationDocument,
    data: Record<string, unknown>,
    allowedFields: string[]
): void {
    for (const [key, value] of Object.entries(data ?? {})) {
        if (key === "id") {
            continue;
        }
        if (!ADMIN_EDITABLE.includes(key)) {
            throw new ValidationError(`Unknown attribute: ${key}`);
        }
        if (!allowedFields.includes(key)) {
            if (application.get(key) !== value) {
                throw new ForbiddenError(`Not allowed to change attribute: ${key}`);
            }
            continue;
        }
        application.set(key, value);
    }
}

export async function createApplication(data: Record<string, unknown>, requester: TokenPayload) {
    const application: ApplicationDocument = new DegreeCourseApplication({ applicantUserID: requester.userID });
    applyFields(application, data, requester.isAdministrator ? ADMIN_EDITABLE : SELF_EDITABLE);
    await ensureReferencesExist(application, true);
    await application.save().catch(rethrowAsValidationError);
    return toResponse(application);
}

export async function getApplications(query: Record<string, unknown>) {
    const filter = Object.fromEntries(
        Object.entries(query).filter(([key, value]) => FILTERABLE.includes(key) && typeof value === "string")
    );
    const applications = await DegreeCourseApplication.find(filter);
    return applications.map(toResponse);
}

export async function getMyApplications(requester: TokenPayload) {
    const applications = await DegreeCourseApplication.find({ applicantUserID: requester.userID });
    return applications.map(toResponse);
}

export async function getApplicationsForDegreeCourse(degreeCourseID: string) {
    if (!(await degreeCourseExists(degreeCourseID))) {
        throw new NotFoundError(`No degree course found with id ${degreeCourseID}`);
    }
    const applications = await DegreeCourseApplication.find({ degreeCourseID });
    return applications.map(toResponse);
}

export async function getApplication(id: string, requester: TokenPayload) {
    const application = await findOrThrow(id);
    checkOwnerOrAdmin(application, requester);
    return toResponse(application);
}

export async function updateApplication(id: string, data: Record<string, unknown>, requester: TokenPayload) {
    const application = await findOrThrow(id);
    checkOwnerOrAdmin(application, requester);
    applyFields(application, data, requester.isAdministrator ? ADMIN_EDITABLE : SELF_EDITABLE);
    await ensureReferencesExist(application, false);
    await application.save().catch(rethrowAsValidationError);
    return toResponse(application);
}

export async function deleteApplication(id: string, requester: TokenPayload): Promise<void> {
    const application = await findOrThrow(id);
    checkOwnerOrAdmin(application, requester);
    await application.deleteOne();
}