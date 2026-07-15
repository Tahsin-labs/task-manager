import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue) => {

    const {
        title,
        description,
        type,
        reporter_id,
    } = payload;

    // Validation

    if (!title) {
        throw new Error("Title is required");
    }

    if (title.length > 150) {
        throw new Error("Title cannot exceed 150 characters");
    }

    if (!description) {
        throw new Error("Description is required");
    }

    if (description.length < 20) {
        throw new Error("Description must be at least 20 characters");
    }

    if (!["bug", "feature_request"].includes(type)) {
        throw new Error("Invalid issue type");
    }

    // Check reporter exists
    const user = await pool.query(
        `
        SELECT * FROM users
        WHERE id = $1
        `,
        [reporter_id]
    );

    if (user.rows.length === 0) {
        throw new Error("Reporter not found");
    }

    // Insert issue
    const result = await pool.query(
        `
        INSERT INTO issues
        (
            title,
            description,
            type,
            reporter_id
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *
        `,
        [
            title,
            description,
            type,
            reporter_id,
        ]
    );

    return result;
};


const getAllIssuesFromDB = async (query: any) => {

    const { sort = "newest", type, status } = query;

    let sql = `SELECT * FROM issues`;
    const values: any[] = [];
    const conditions: string[] = [];

    if (type) {
        values.push(type);
        conditions.push(`type=$${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status=$${values.length}`);
    }

    if (conditions.length) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += sort === "oldest"
        ? " ORDER BY created_at ASC"
        : " ORDER BY created_at DESC";

    const issues = await pool.query(sql, values);

    
    // Fetch reporters (NO JOIN)
   

    const reporterIds = [
        ...new Set(
            issues.rows.map(issue => issue.reporter_id)
        )
    ];

    let reporters: any[] = [];

    if (reporterIds.length) {

        const placeholders = reporterIds
            .map((_, i) => `$${i + 1}`)
            .join(",");

        const reporterResult = await pool.query(
            `
            SELECT id,name,role
            FROM users
            WHERE id IN (${placeholders})
            `,
            reporterIds
        );

        reporters = reporterResult.rows;
    }

   
    // Merge
   

    const data = issues.rows.map(issue => {

        const reporter = reporters.find(
            user => user.id === issue.reporter_id
        );

        return {

            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,

            reporter,

            created_at: issue.created_at,
            updated_at: issue.updated_at

        };

    });

    return data;

};

const getSingleIssueFromDB = async (id: string) => {

    // Find the issue
    const issueResult = await pool.query(
        `
        SELECT *
        FROM issues
        WHERE id = $1
        `,
        [id]
    );

    if (issueResult.rows.length === 0) {
        return null;
    }

    const issue = issueResult.rows[0];

    // Find the reporter (NO JOIN)
    const reporterResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0] || null;

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };
};


const updateIssueIntoDB = async (
    id: string,
    payload: IIssue,
    user: JwtPayload
) => {

    const { title, description, type } = payload;

    // Find issue
    const issueResult = await pool.query(
        `
        SELECT *
        FROM issues
        WHERE id=$1
        `,
        [id]
    );

    if (issueResult.rows.length === 0) {
        throw new Error("Issue not found");
    }

    const issue = issueResult.rows[0];

    // Maintainer can update any issue
    if (user.role !== "maintainer") {

        // Contributor can update only own issue
        if (issue.reporter_id !== user.id) {
            throw new Error("You can only update your own issues");
        }

        // Contributor can update only if status is open
        if (issue.status !== "open") {
            throw new Error("Issue is no longer editable");
        }
    }

    // Validate type if provided
    if (
        type &&
        !["bug", "feature_request"].includes(type)
    ) {
        throw new Error("Invalid issue type");
    }

    // Validate title if provided
    if (title && title.length > 150) {
        throw new Error("Title cannot exceed 150 characters");
    }

    // Validate description if provided
    if (description && description.length < 20) {
        throw new Error("Description must be at least 20 characters");
    }

    const result = await pool.query(
        `
        UPDATE issues
        SET
            title = COALESCE($1,title),
            description = COALESCE($2,description),
            type = COALESCE($3,type),
            updated_at = NOW()
        WHERE id=$4
        RETURNING *
        `,
        [
            title,
            description,
            type,
            id,
        ]
    );

    return result;
};


const deleteIssueFromDB = async (id: string) => {

    const result = await pool.query(
        `
        DELETE FROM issues
        WHERE id=$1
        `,
        [id]
    );

    return result;

};




export const issueService = {
    createIssueIntoDB,getAllIssuesFromDB, getSingleIssueFromDB,
    updateIssueIntoDB,
    deleteIssueFromDB
};