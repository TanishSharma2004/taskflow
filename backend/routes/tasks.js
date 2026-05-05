const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT t.*, u.name as assigned_name
     FROM tasks t
     LEFT JOIN users u ON u.id = t.assigned_to
     WHERE t.project_id = $1`,
    [req.params.projectId]
  );
  res.json(result.rows);
});

// Dashboard summary
router.get('/dashboard', auth, async (req, res) => {
  const userId = req.user.id;

  const total = await pool.query(
    `SELECT COUNT(*) FROM tasks t
     JOIN project_members pm ON pm.project_id = t.project_id
     WHERE pm.user_id = $1`, [userId]
  );
  const byStatus = await pool.query(
    `SELECT status, COUNT(*) FROM tasks t
     JOIN project_members pm ON pm.project_id = t.project_id
     WHERE pm.user_id = $1 GROUP BY status`, [userId]
  );
  const overdue = await pool.query(
    `SELECT COUNT(*) FROM tasks t
     JOIN project_members pm ON pm.project_id = t.project_id
     WHERE pm.user_id = $1 AND t.due_date < NOW() AND t.status != 'done'`, [userId]
  );
  const perUser = await pool.query(
    `SELECT u.name, COUNT(t.id) as task_count
     FROM tasks t
     JOIN users u ON u.id = t.assigned_to
     JOIN project_members pm ON pm.project_id = t.project_id
     WHERE pm.user_id = $1
     GROUP BY u.name`, [userId]
  );

  res.json({
    total: total.rows[0].count,
    byStatus: byStatus.rows,
    overdue: overdue.rows[0].count,
    perUser: perUser.rows
  });
});

// Create task (admin only)
router.post('/', auth, async (req, res) => {
  const { title, description, due_date, priority, project_id, assigned_to } = req.body;
  if (!title || !project_id) return res.status(400).json({ error: 'Title and project required' });

  const adminCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [project_id, req.user.id]
  );
  if (!adminCheck.rows.length || adminCheck.rows[0].role !== 'admin')
    return res.status(403).json({ error: 'Only admin can create tasks' });

  const result = await pool.query(
    `INSERT INTO tasks (title, description, due_date, priority, project_id, assigned_to, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, description, due_date, priority || 'medium', project_id, assigned_to, req.user.id]
  );
  res.json(result.rows[0]);
});

// Update task status
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['todo', 'inprogress', 'done'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  // Check if user is member of this task's project
  const task = await pool.query('SELECT * FROM tasks WHERE id=$1', [req.params.id]);
  if (!task.rows.length) return res.status(404).json({ error: 'Task not found' });

  const member = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [task.rows[0].project_id, req.user.id]
  );
  if (!member.rows.length) return res.status(403).json({ error: 'Not a project member' });

  const result = await pool.query(
    'UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *',
    [status, req.params.id]
  );
  res.json(result.rows[0]);
});

// Delete task (admin only)
router.delete('/:id', auth, async (req, res) => {
  const task = await pool.query('SELECT * FROM tasks WHERE id=$1', [req.params.id]);
  if (!task.rows.length) return res.status(404).json({ error: 'Task not found' });

  const adminCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [task.rows[0].project_id, req.user.id]
  );
  if (!adminCheck.rows[0]?.role !== 'admin')
    return res.status(403).json({ error: 'Only admin can delete tasks' });

  await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
