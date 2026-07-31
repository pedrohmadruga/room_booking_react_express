/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Home
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: API is online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the API!
 */
