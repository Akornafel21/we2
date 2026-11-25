import { Schema, model } from "mongoose";

export interface IDegreeCourseApplication {
    applicantUserID: string;
    degreeCourseID: string;
    targetPeriodYear: number;
    targetPeriodShortName: string;
}

const degreeCourseApplicationSchema = new Schema<IDegreeCourseApplication>(
    {
        applicantUserID: { type: String, required: true, index: true },
        degreeCourseID: { type: String, required: true, index: true },
        targetPeriodYear: { type: Number, required: true },
        targetPeriodShortName: { type: String, required: true },
    },
    { versionKey: false }
);

export const DegreeCourseApplication = model<IDegreeCourseApplication>(
    "DegreeCourseApplication",
    degreeCourseApplicationSchema
);