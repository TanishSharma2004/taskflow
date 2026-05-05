const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get my projects
router.get('/', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT p.*, u.name as admin_name, pm.role
     FROM projects p
     JOIN project_members pm ON pm.project_id = p.id
     JOIN users u ON u.id = p.admin_id
     WHERE pm.user_id = $1`,
    [req.user.id]
  );
  res.json(result.rows);
});

// Create project
router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    const proj = await pool.query(
      'INSERT INTO projects (name, description, admin_id) VALUES ($1,$2,$3) RETURNING *',
      [name, description, req.user.id]
    );
    // Add creator as admin member
    await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,$3)',
      [proj.rows[0].id, req.user.id, 'admin']
    );
    res.json(proj.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member to project
router.post('/:id/members', auth, async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  // Only admin can add
  const adminCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [id, req.user.id]
  );
  if (!adminCheck.rows.length || adminCheck.rows[0].role !== 'admin')
    return res.status(403).json({ error: 'Only admin can add members' });

  const userRes = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (!userRes.rows.length) return res.status(404).json({ error: 'User not found' });

  const userId = userRes.rows[0].id;
  await pool.query(
    'INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
    [id, userId, 'member']
  );
  res.json({ message: 'Member added' });
});

// Get members of a project
router.get('/:id/members', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, pm.role
     FROM project_members pm
     JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = $1`,
    [req.params.id]
  );
  res.json(result.rows);
});

// Remove member
router.delete('/:id/members/:userId', auth, async (req, res) => {
  const adminCheck = await pool.query(
    'SELECT role FROM project_members WHERE project_id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  if (!adminCheck.rows.length || adminCheck.rows[0].role !== 'admin')
    return res.status(403).json({ error: 'Only admin can remove members' });

  await pool.query(
    'DELETE FROM project_members WHERE project_id=$1 AND user_id=$2',
    [req.params.id, req.params.userId]
  );
  res.json({ message: 'Member removed' });
});

module.exports = router;