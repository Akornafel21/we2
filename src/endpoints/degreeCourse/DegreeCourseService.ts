import mongoose, { HydratedDocument } from "mongoose";
import { DegreeCourse, IDegreeCourse } from "./DegreeCourseModel";
import { NotFoundError, ValidationError, rethrowAsValidationError } from "../../utils/Errors";

const FIELDS = [
    "name",
    "shortName",
    "universityName",
    "universityShortName",
    "departmentName",
    "departmentShortName",
];

function toResponse(course: HydratedDocument<IDegreeCourse>) {
    return {
        id: course._id.toString(),
        name: course.name,
        shortName: course.shortName,
        universityName: course.universityName,
        universityShortName: course.universityShortName,
        departmentName: course.departmentName,
        departmentShortName: course.departmentShortName,
    };
}

async function findOrThrow(id: string) {
    const course = mongoose.isValidObjectId(id) ? await DegreeCourse.findById(id) : null;
    if (!course) {
        throw new NotFoundError(`No degree course found with id ${id}`);
    }
    return course;
}

function applyFields(course: HydratedDocument<IDegreeCourse>, data: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(data)) {
        if (key === "id") {
            continue;
        }
        if (!FIELDS.includes(key)) {
            throw new ValidationError(`Unknown attribute: ${key}`);
        }
        course.set(key, value);
    }
}

export async function getDegreeCourses(query: Record<string, unknown>) {
    const filter = Object.fromEntries(
        Object.entries(query).filter(([key, value]) => FIELDS.includes(key) && typeof value === "string")
    );
    const courses = await DegreeCourse.find(filter);
    return courses.map(toResponse);
}

export async function getDegreeCourse(id: string) {
    const course = await findOrThrow(id);
    return toResponse(course);
}

export async function createDegreeCourse(data: Record<string, unknown>) {
    const course = new DegreeCourse();
    applyFields(course, data);
    await course.save().catch(rethrowAsValidationError);
    return toResponse(course);
}

export async function updateDegreeCourse(id: string, data: Record<string, unknown>) {
    const course = await findOrThrow(id);
    applyFields(course, data);
    await course.save().catch(rethrowAsValidationError);
    return toResponse(course);
}

export async function deleteDegreeCourse(id: string): Promise<void> {
    const course = await findOrThrow(id);
    await course.deleteOne();
}