import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from  "./pages/Home";
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import Navbar from './component/common/Navbar';
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import MyProfile from './component/core/Dashboard/MyProfile';
import Error from "./pages/Error";
import EnrolledCourses from './component/core/Dashboard/EnrolledCourses';
import Cart from './component/core/Dashboard/CartComponect/Cart';
import AddCourse from './component/core/Dashboard/AddCourse/AddCourse';
import MyCourses from './component/core/Dashboard/MyCourses';
import EditCourse from './component/core/Dashboard/EditCourse';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import ViewCourseSidebar from './component/core/ViewCourse/ViewCourseSidebar';
import LectureDetails from './component/core/ViewCourse/LectureDetails';
import Instructor from "./component/core/InstructorDashboard/Instructor"
import ContactUs from './pages/ContactUs';
import Settings from './component/core/Dashboard/Setting/Settings';
import OpenRoute from "./component/core/Auth/OpenRoute"
import PrivateRoute from "./component/core/Auth/PrivateRoute"
import { ACCOUNT_TYPE } from './utils/constant';
import { useSelector } from 'react-redux';


function App() {
  const {user} = useSelector((state) => state.profile);
  return (
    <div className='w-screen min-h-screen bg-richblack-900 font-inter flex flex-col'> 
        <Navbar/>
        <Routes>
           <Route path="/" element={<Home/>} />
           <Route path="/login" element={<OpenRoute>
                                             <Login/>
                                        </OpenRoute>} />
           <Route path="/signup" element={
                                        <OpenRoute>
                                            <SignUp/>
                                        </OpenRoute>
                                      } />
           <Route path="/forgot-password" element={<ResetPassword/>} />
           <Route path="/reset-password/:id" element={<UpdatePassword/>}/>
           <Route path="/verify-email" element={<VerifyEmail/>}/>
           <Route path="/about" element={<About/>}/>
           <Route path="/catalog/:catalogName" element={<Catalog/>}/>
           <Route path='/course/:courseId' element={<CourseDetails/>}/>
           <Route path='/contact' element={<ContactUs/>}/>

           
          

            {/* nested Route for dashboard   */}
            <Route
            element={<PrivateRoute>
                      <Dashboard/>
                     </PrivateRoute>}>
                <Route path='dashboard/my-profile' element={<MyProfile/>}/>
                <Route path='dashboard/settings' element={<Settings/>}/>
                {
                   user !== null  && 
                      user.accountType === ACCOUNT_TYPE.STUDENT  && (
                        <>
                          <Route path='dashboard/cart' element={<Cart/>}/>
                          <Route path='dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
                        </>
                      )
                }

                {
                   user !== null && user.accountType === ACCOUNT_TYPE.INSTRUCTOR  && (
                     <>
                     <Route path="dashboard/instructor" element={<Instructor/>}/>
                     <Route path='dashboard/add-course' element={<AddCourse/>}/>
                     <Route path='dashboard/my-courses' element={<MyCourses/>}/>
                     <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
                     </>
                   )
                }
            </Route>


            <Route
             element={<PrivateRoute>
                       <ViewCourse/>
                     </PrivateRoute>}>
                {
                   user !== null && user.accountType === ACCOUNT_TYPE.STUDENT  && (
                     <>
                       <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<LectureDetails/>}/>
                     </>
                   )
                }
            </Route>


            {/* 404 Page */}
           <Route path="*" element={<Error />} />
        </Routes>
    </div>
  );
}

export default App;
