<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Dashboard</h2>
        <p class="text-muted">Welcome back, Admin. Here is your daily overview.</p>
      </div>
      <span class="date text-muted bg-white px-3 py-2 rounded-pill shadow-sm">
        <i class="bi bi-calendar me-2"></i> Today, {{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
      </span>
    </div>

    <!-- ===== Stats Cards ===== -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <span class="text-muted">Active courses</span>
          <div class="d-flex justify-content-between align-items-end mt-2">
            <h3 class="mb-0 fw-bold">24</h3>
            <span class="badge bg-success-subtle text-success">+5%</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <span class="text-muted">Total Tests</span>
          <div class="d-flex justify-content-between align-items-end mt-2">
            <h3 class="mb-0 fw-bold">150</h3>
            <span class="badge bg-success-subtle text-success">+12%</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <span class="text-muted">Available Games</span>
          <div class="d-flex justify-content-between align-items-end mt-2">
            <h3 class="mb-0 fw-bold">12</h3>
            <span class="badge bg-success-subtle text-success">+5%</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <span class="text-muted">Active Quizzes</span>
          <div class="d-flex justify-content-between align-items-end mt-2">
            <h3 class="mb-0 fw-bold">45</h3>
            <span class="badge bg-success-subtle text-success">+8%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Quick Actions ===== -->
    <h5 class="mb-3 fw-bold">Quick Actions</h5>
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="action-card cursor-pointer" @click="$router.push('/admin/courses')">
          <div class="icon-box bg-primary-subtle text-primary">
            <i class="bi bi-plus-circle fs-4"></i>
          </div>
          <div>
            <strong class="d-block">Add Course</strong>
            <p class="mb-0 text-muted small">Create new module</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="action-card cursor-pointer" @click="$router.push('/admin/exams')">
          <div class="icon-box bg-info-subtle text-info">
            <i class="bi bi-ui-checks fs-4"></i>
          </div>
          <div>
            <strong class="d-block">Create Quiz</strong>
            <p class="mb-0 text-muted small">New assessment</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="action-card cursor-pointer">
          <div class="icon-box bg-warning-subtle text-warning">
            <i class="bi bi-cloud-upload fs-4"></i>
          </div>
          <div>
            <strong class="d-block">Upload Game</strong>
            <p class="mb-0 text-muted small">Add interactive content</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Activity + Chart ===== -->
    <div class="row g-4">
      <div class="col-md-8">
        <div class="card-box h-100">
          <h6 class="fw-bold mb-3">Recent Activity</h6>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <tbody>
                <tr>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-circle-fill text-primary" style="font-size: 8px;"></i>
                      <span>New Math Quiz Added</span>
                    </div>
                  </td>
                  <td class="text-muted small">Oct 24, 2025</td>
                  <td><span class="badge bg-light text-dark border">Admin User</span></td>
                </tr>
                <tr>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-circle-fill text-success" style="font-size: 8px;"></i>
                      <span>Science course updated</span>
                    </div>
                  </td>
                  <td class="text-muted small">Oct 24, 2025</td>
                  <td><span class="badge bg-light text-dark border">Admin User</span></td>
                </tr>
                <tr>
                   <td>
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-circle-fill text-info" style="font-size: 8px;"></i>
                      <span>New student registered</span>
                    </div>
                  </td>
                  <td class="text-muted small">Oct 23, 2025</td>
                  <td><span class="badge bg-light text-dark border">System</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card-box h-100 text-center">
          <h6 class="fw-bold mb-3">Content Distribution</h6>
          <div class="circle-chart">
            <div class="inner-circle">
              <h3 class="mb-0 fw-bold">231</h3>
              <p class="mb-0 text-muted small">Total Items</p>
            </div>
          </div>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <div class="d-flex align-items-center gap-1 small">
              <span class="dot bg-primary"></span> Courses
            </div>
            <div class="d-flex align-items-center gap-1 small">
              <span class="dot bg-success"></span> Tests
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  height: 100%;
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-3px);
}

.action-card {
  background: #fff;
  padding: 15px 20px;
  border-radius: 16px;
  display: flex;
  gap: 15px;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: all 0.2s;
}
.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-box {
  background: #fff;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.circle-chart {
  margin: 20px auto;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(#00aaff 0% 60%, #90EE90 60% 85%, #f0f0f0 85% 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-circle {
  width: 130px;
  height: 130px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
