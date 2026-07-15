import type { Request, Response } from "express";
import { issueService } from "./issue.service";
// import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {

        const reporter_id = req.user?.id;

        const payload = {
            ...req.body,
            reporter_id,
        };

        const result = await issueService.createIssueIntoDB(payload);

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result.rows[0],
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });

    }
};


const getAllIssues = async (req: Request, res: Response) => {
    try {

        const result = await issueService.getAllIssuesFromDB(req.query);

        res.status(200).json({
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });

    }
};

const getSingleIssue = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const result = await issueService.getSingleIssueFromDB(id as string);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
                data: {}
            });
        }

        res.status(200).json({
            success: true,
            message: "Issue retrieved successfully",
            data: result,
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });

    }

};


const updateIssue = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const user = req.user!;

        const result = await issueService.updateIssueIntoDB(
            id as string,
            req.body,
            user
        );

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0],
        });

    } catch (error: any) {

        if (error.message === "Issue not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (
            error.message === "Forbidden" ||
            error.message === "You can only update your own issues"
        ) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "Issue is no longer editable") {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });

    }

};


const deleteIssue = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const result = await issueService.deleteIssueFromDB(id as string);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });

    } catch (error: any) {

        res.status(500).json({
            success: false,
            message: error.message,
            error,
        });

    }

};

export const issueController = {
    createIssue, getAllIssues, getSingleIssue, updateIssue,deleteIssue,
};