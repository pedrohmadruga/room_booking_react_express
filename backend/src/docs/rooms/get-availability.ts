/**
 * @openapi
 * /rooms/{id}/availability:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Check room availability
 *     description: Returns whether the room is free for the given day and shift.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-08-15"
 *       - in: query
 *         name: shift
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Shift'
 *     responses:
 *       200:
 *         description: Availability result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *       400:
 *         description: Invalid day or shift
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Room not found
 */
