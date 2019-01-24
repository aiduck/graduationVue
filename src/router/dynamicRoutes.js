
// const Dashboard = () => import('@/components/page/Dashboard.vue')

const DasicInfo = () => import('@/components/page/BaseInfo.vue')

const UserInfo = () => import('@/components/page/UserInfo.vue')
const UserDetails = () => import('@/components/page/UserInfoDetail.vue')

const TeacherInfo = () => import('@/components/page/TeacherInfo.vue')
const TeacherInfoDetail = () => import('@/components/page/TeacherInfoDetail.vue')

const StudentInfo = () => import('@/components/page/StudentInfo.vue')
const StudentInfoDetail = () => import('@/components/page/StudentInfoDetail.vue')

const CourseInfo = () => import('@/components/page/CourseInfo.vue')
const CourseInfoDetail = () => import('@/components/page/CourseInfoDetail.vue')

const ClassInfo = () => import('@/components/page/ClassInfo.vue')
const ClassInfoDetail = () => import('@/components/page/ClassInfoDetail.vue')
const ClassMemeberInfo = () => import('@/components/page/ClassMemeberInfo.vue')

const ProjectInfo = () => import('@/components/page/ProjectInfo.vue')
const ProjectInfoDetail = () => import('@/components/page/ProjectInfoDetail.vue')
const ProjectTeamInfo = () => import('@/components/page/ProjectTeamInfo.vue')
const ProjectTeamDetail = () => import('@/components/page/ProjectTeamDetail.vue')

const ProjectReport = () => import('@/components/page/ProjectReport.vue')
const projectReportDetail = () => import('@/components/page/ProjectReportDetail.vue')

const ProjectAchi = () => import('@/components/page/ProjectAchi.vue')
const ProjectAchiDetail = () => import('@/components/page/ProjectAchiDetail.vue')


// 所有路由
const dynamicRoutes =  [
  // {
  //     path: '/dashboard',
  //     name: 'dashboard',
  //     component: Dashboard,
  //     meta: { title: '个人中心' }
  // },
  {
    // 学院专业班级
    path: '/basicInfo',
    name: 'basicInfo',
    component: DasicInfo,
    meta: { title: '基础信息' }
  },
  {
    // 用户信息
    path: '/userInfo',
    name: 'userInfo',
    component: UserInfo,
    meta: { title: '用户基础信息' },
  },
  {
    // 用户信息详情页
    path: '/userDetails/:userId/:isCheck',
    name: 'userDetails',
    component: UserDetails,
    meta: { title: '用户详情页' }
  },
  {
    // 教师信息
    path: '/teacherInfo',
    name:'teacherInfo',
    component: TeacherInfo,
    meta: { title: '教师基本信息' }
  },
  {
    // 教师信息
    path: '/teacherInfo/:userId/:isCheck',
    name: 'teacherDetaile',
    component: TeacherInfoDetail,
    meta: { title: '教师详情页' }
  },
  {
    // 学生信息
    path: '/studentInfo',
    name: 'studentInfo',
    component: StudentInfo,
    meta: { title: '学生基本信息' }
  },
  {
    // 学生信息
    path: '/studentInfo/:userId/:isCheck',
    name: 'studentDetail',
    component: StudentInfoDetail,
    meta: { title: '学生详情页' }
  },
  {
    // 课程管理
    path: '/courseInfo',
    name: 'courseInfo',
    component: CourseInfo,
    meta: { title: '课程管理' }
  },
  {
    // 课程管理详情
    path: '/courseInfo/:courseId/:isCheck',
    name: 'courseDetail',
    component: CourseInfoDetail,
    meta: { title: '课程详情管理' }
  },
  {
    // 班级基本信息
    path: '/classInfo',
    name: 'classInfo',
    component: ClassInfo,
    meta: { title: '教学班级管理' }
  },
  {
    // 班级详情信息
    path: '/classInfo/:classId/:isCheck',
    name: 'classDetail',
    component: ClassInfoDetail,
    meta: { title: '教学班级详情' }
  },
  {
    // 班级成员信息
    path: '/classMemeberInfo',
    name: 'classMemeberInfo',
    component: ClassMemeberInfo,
    meta: { title: '班级成员信息' }
  },
  {
    // 项目案例库信息
    path: '/projectInfo',
    name: 'projectInfo',
    component: ProjectInfo,
    meta: { title: '项目案例库信息' }
  },
  {
    // 项目案例库详情
    path: '/projectDetailInfo/:projectId/:isCheck',
    name: 'projectDetail',
    component: ProjectInfoDetail,
    meta: { title: '项目案例库详情' }
  },
  {
    // 项目组
    path: '/projectTeamInfo',
    name: 'projectTeamInfo',
    component: ProjectTeamInfo,
    meta: { title: '项目组' }
  },
  {
    // 项目组详细信息
    path: '/projectTeamDetail/:teamId/:isCheck',
    name: 'projectTeamDetail',
    component: ProjectTeamDetail,
    meta: { title: '项目组详细信息' }
  },
  {
    path: '/projectReport',
    name: 'projectReport',
    component: ProjectReport,
    meta: { title: '项目日报' }
  },
  {
    path: '/projectReportDetail/:reportId/:isCheck',
    name: 'projectReportDetail',
    component: projectReportDetail,
    meta: { title: '项目日报详细信息' }
  },
  {
    path: '/projectAchi',
    name: 'projectAchi',
    component: ProjectAchi,
    meta: { title: '项目成果' }
  },
  {
    path: '/projectAchiDetail/:deliveryId/:isCheck',
    name: 'projectAchiDetail',
    component: ProjectAchiDetail,
    meta: { title: '项目成果详细信息' }
  },
  
]


export default dynamicRoutes