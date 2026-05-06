-- ============================================================
-- RBAC SECURITY MODEL - QuizPatenteB SaaS Platform
-- ============================================================
-- This file documents the complete Role-Based Access Control system
-- and provides Row Level Security policies for future use with Supabase Auth.
--
-- CURRENT AUTHENTICATION: Application-level (session tokens via API)
-- FUTURE MIGRATION: These RLS policies will be activated when migrating
-- to Supabase Auth (JWT-based authentication)
--
-- ROLES:
--   super_admin - Platform owner, full access to everything
--   teacher     - Access only to owned students and data
--   student     - Access only to own data
--
-- OWNERSHIP HIERARCHY:
--   super_admin: owner_id = NULL
--   teacher:     owner_id = super_admin.id (or NULL for first admin)
--   student:     owner_id = teacher.id
-- ============================================================

-- NOTE: RLS is currently DISABLED on all tables because the app
-- uses application-level authentication (session tokens).
-- To enable RLS, uncomment the ALTER TABLE statements below
-- and ensure Supabase Auth is properly configured.

-- ============================================================
-- 1. APP_USERS TABLE - User Management
-- ============================================================

-- Enable RLS (uncomment when migrating to Supabase Auth)
-- ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
-- CREATE POLICY "users_read_own" ON app_users
--   FOR SELECT USING (auth.uid()::text = id::text);

-- Policy: Teachers can read their own students
-- CREATE POLICY "teachers_read_students" ON app_users
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'teacher'
--     )
--     AND role = 'student'
--     AND owner_id = auth.uid()::uuid
--   );

-- Policy: Super admin can read everything
-- CREATE POLICY "superadmin_read_all" ON app_users
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );

-- Policy: Teachers can insert students (only their own)
-- CREATE POLICY "teachers_insert_students" ON app_users
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role IN ('teacher', 'super_admin')
--     )
--     AND role = 'student'
--     AND owner_id = auth.uid()::uuid
--   );

-- Policy: Super admin can insert any user
-- CREATE POLICY "superadmin_insert_any" ON app_users
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );

-- Policy: Super admin can update any user
-- CREATE POLICY "superadmin_update_any" ON app_users
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );

-- Policy: Users can update their own profile
-- CREATE POLICY "users_update_own" ON app_users
--   FOR UPDATE USING (auth.uid()::text = id::text)
--   WITH CHECK (auth.uid()::text = id::text);

-- Policy: Super admin can delete (soft) any user
-- CREATE POLICY "superadmin_delete_any" ON app_users
--   FOR DELETE USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );


-- ============================================================
-- 2. USER_PROGRESS TABLE - Progress Data
-- ============================================================

-- Enable RLS
-- ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own progress
-- CREATE POLICY "progress_own" ON user_progress
--   FOR ALL USING (
--     user_id = auth.uid()::text
--   );

-- Policy: Teachers can read their students' progress
-- CREATE POLICY "progress_teachers_read" ON user_progress
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM app_users 
--       WHERE app_users.id = auth.uid()::uuid 
--       AND app_users.role = 'teacher'
--       AND app_users.id = user_progress.user_id
--     )
--   );

-- Policy: Super admin can access all progress
-- CREATE POLICY "progress_superadmin" ON user_progress
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );


-- ============================================================
-- 3. ASSIGNMENTS TABLE - Teacher Assignments
-- ============================================================

-- Enable RLS
-- ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can manage their own assignments
-- CREATE POLICY "assignments_own" ON assignments
--   FOR ALL USING (teacher_id = auth.uid()::uuid);

-- Policy: Students can read assignments assigned to them
-- CREATE POLICY "assignments_students_read" ON assignments
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM assignment_students
--       WHERE assignment_students.assignment_id = assignments.id
--       AND assignment_students.student_id = auth.uid()::uuid
--     )
--   );

-- Policy: Super admin can manage all assignments
-- CREATE POLICY "assignments_superadmin" ON assignments
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );


-- ============================================================
-- 4. ASSIGNMENT_STUDENTS TABLE - Student-Assignment Link
-- ============================================================

-- Enable RLS
-- ALTER TABLE assignment_students ENABLE ROW LEVEL SECURITY;

-- Policy: Students can read their own assignments
-- CREATE POLICY "assignment_students_own" ON assignment_students
--   FOR SELECT USING (student_id = auth.uid()::uuid);

-- Policy: Teachers can manage their own assignment links
-- CREATE POLICY "assignment_students_teacher" ON assignment_students
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM assignments
--       WHERE assignments.id = assignment_students.assignment_id
--       AND assignments.teacher_id = auth.uid()::uuid
--     )
--   );

-- Policy: Super admin can manage all
-- CREATE POLICY "assignment_students_superadmin" ON assignment_students
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );


-- ============================================================
-- 5. ASSIGNMENT_RESULTS TABLE - Quiz Results
-- ============================================================

-- Enable RLS
-- ALTER TABLE assignment_results ENABLE ROW LEVEL SECURITY;

-- Policy: Students can read their own results
-- CREATE POLICY "results_own" ON assignment_results
--   FOR SELECT USING (student_id = auth.uid()::uuid);

-- Policy: Teachers can read results for their assignments
-- CREATE POLICY "results_teacher" ON assignment_results
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM assignments
--       WHERE assignments.id = assignment_results.assignment_id
--       AND assignments.teacher_id = auth.uid()::uuid
--     )
--   );

-- Policy: Students can insert their own results
-- CREATE POLICY "results_insert_own" ON assignment_results
--   FOR INSERT WITH CHECK (student_id = auth.uid()::uuid);

-- Policy: Super admin can access all results
-- CREATE POLICY "results_superadmin" ON assignment_results
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );


-- ============================================================
-- 6. QUESTION_PROGRESS TABLE - Per-Question Tracking
-- ============================================================

-- Enable RLS
-- ALTER TABLE question_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own question progress
-- CREATE POLICY "question_progress_own" ON question_progress
--   FOR ALL USING (user_id = auth.uid()::text);

-- Policy: Teachers can read their students' progress
-- CREATE POLICY "question_progress_teacher" ON question_progress
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM app_users
--       WHERE app_users.id = question_progress.user_id
--       AND app_users.owner_id = auth.uid()::uuid
--       AND app_users.role = 'student'
--     )
--   );

-- Policy: Super admin can access all
-- CREATE POLICY "question_progress_superadmin" ON question_progress
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin'
--     )
--   );


-- ============================================================
-- APPLICATION-LEVEL SECURITY (CURRENT IMPLEMENTATION)
-- ============================================================
-- 
-- Since the app currently uses application-level authentication,
-- security is enforced in the API routes (not RLS):
--
-- 1. verifySession() in /src/lib/auth.ts:
--    - Decodes Bearer token from Authorization header
--    - Validates against app_users table in Supabase
--    - Returns VerifiedUser with id, role, owner_id
--
-- 2. Each API route verifies the session:
--    - /api/auth: Role-based action routing
--    - /api/progress: User/teacher/super_admin access control
--    - /api/assignments: Teacher ownership verification
--    - /api/ai: Per-user rate limiting by verified ID
--
-- 3. Client-side: authenticatedFetch() in /src/lib/api.ts
--    - Automatically attaches Bearer token to all requests
--    - Used throughout the entire frontend
--
-- SECURITY MATRIX:
-- ┌─────────────────┬────────────┬─────────┬─────────┐
-- │ Resource        │ super_admin│ teacher │ student │
-- ├─────────────────┼────────────┼─────────┼─────────┤
-- │ All users       │ ✅ READ    │ ❌      │ ❌      │
-- │ Teachers list   │ ✅ READ    │ ❌      │ ❌      │
-- │ Own students    │ ✅ CRUD    │ ✅ CRUD │ ❌      │
-- │ Other students  │ ✅ CRUD    │ ❌      │ ❌      │
-- │ Own progress    │ ✅ CRUD    │ ✅ CRUD │ ✅ CRUD │
-- │ Other progress  │ ✅ READ    │ ✅ READ │ ❌      │
-- │ Assignments     │ ✅ CRUD    │ ✅ CRUD │ ✅ READ │
-- │ AI features     │ ✅         │ ✅      │ ✅      │
-- │ Admin panel     │ ✅         │ ❌      │ ❌      │
-- └─────────────────┴────────────┴─────────┴─────────┘
--
-- TO MIGRATE TO SUPABASE AUTH:
-- 1. Set up Supabase Auth project
-- 2. Migrate users to auth.users table
-- 3. Replace session tokens with JWT from Supabase Auth
-- 4. Enable RLS by uncommenting ALTER TABLE statements
-- 5. Remove application-level auth checks from API routes
-- 6. Use service_role key for admin operations
