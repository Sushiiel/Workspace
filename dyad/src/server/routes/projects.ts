import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { boltProjects, boltFiles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/projects', async (req: Request, res: Response) => {
    try {
        console.log(`📂 Fetching all projects`);

        const allProjects = await db.select()
            .from(boltProjects);

        console.log(`📊 Found ${allProjects.length} projects`);

        res.json(allProjects);
    } catch (error: any) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/projects/:id
 * Get a specific project
 */
router.get('/projects/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [project] = await db.select()
            .from(boltProjects)
            .where(eq(boltProjects.id, id))
            .limit(1);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (error: any) {
        console.error('❌ Error fetching project:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/sync/files
 * Upload files from Bolt - creates project and files
 */
router.post('/sync/files', async (req: Request, res: Response) => {
    try {
        const { projectId, projectName, framework, template, files } = req.body;

        console.log(`💾 Syncing files`);
        console.log(`📦 Project: ${projectName} (${projectId})`);
        console.log(`📁 Files to sync: ${files?.length || 0}`);

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files to sync' });
        }

        // Check if project already exists
        const [existingProject] = await db.select()
            .from(boltProjects)
            .where(eq(boltProjects.id, projectId))
            .limit(1);

        if (!existingProject) {
            // Create new project
            const now = Math.floor(Date.now() / 1000);
            await db.insert(boltProjects).values({
                id: projectId,
                name: projectName || 'Untitled Project',
                description: `Generated from Bolt`,
                template: template || null,
                framework: framework || null,
                createdAt: now,
                updatedAt: now,
            } as any);

            console.log(`✅ Created project ${projectId}`);
        } else {
            console.log(`📝 Updating existing project ${projectId}`);
        }

        // Delete existing files for this project
        await db.delete(boltFiles)
            .where(eq(boltFiles.projectId, projectId));

        // Insert files
        const fileRecords = files.map((file: any) => ({
            id: crypto.randomUUID(),
            projectId: projectId,
            path: file.path,
            content: file.content || '',
            type: 'file',
            createdAt: Math.floor(Date.now() / 1000),
            updatedAt: Math.floor(Date.now() / 1000),
        }));

        if (fileRecords.length > 0) {
            await db.insert(boltFiles).values(fileRecords);
            console.log(`✅ Inserted ${fileRecords.length} files`);
        }

        res.json({
            success: true,
            message: `Synced ${files.length} files to project ${projectName}`,
            projectId,
            filesCount: files.length,
        });

    } catch (error: any) {
        console.error('❌ Error syncing files:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/files
 * Get files for a project
 */
router.get('/files', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        console.log(`📁 Fetching files for project: ${projectId}`);

        // Get files for this project
        const projectFiles = await db.select()
            .from(boltFiles)
            .where(eq(boltFiles.projectId, projectId as string));

        console.log(`📊 Found ${projectFiles.length} files`);

        res.json(projectFiles);
    } catch (error: any) {
        console.error('❌ Error fetching files:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete('/projects/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Deleting project ${id}`);

        // Delete files first (cascade should handle this, but being explicit)
        await db.delete(boltFiles)
            .where(eq(boltFiles.projectId, id));

        // Delete project
        await db.delete(boltProjects)
            .where(eq(boltProjects.id, id));

        console.log(`✅ Project ${id} deleted`);

        res.json({ success: true });
    } catch (error: any) {
        console.error('❌ Error deleting project:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

