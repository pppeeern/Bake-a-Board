// return (
//     <div className="wrapper-m">
//       <div style={{ textAlign: "center", marginBottom: "20px" }}>
//         <h2>{isLogin ? "Login" : "Register"}</h2>
//         <p>
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <button
//             type="button"
//             onClick={toggleMode}
//             style={{
//               background: "none",
//               border: "none",
//               color: "#007bff",
//               cursor: "pointer",
//               textDecoration: "underline",
//             }}
//           >
//             {isLogin ? "Register here" : "Login here"}
//           </button>
//         </p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="flex-col">
//           {!isLogin && (
//             <div style={{ display: "flex", flexDirection: "column-reverse" }}>
//               <input
//                 id="in_username"
//                 type="text"
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 style={{ borderColor: errors.username ? "red" : "" }}
//               />
//               <label htmlFor="in_username">Username</label>
//               {errors.username && (
//                 <span style={{ color: "red", fontSize: "14px" }}>
//                   {errors.username}
//                 </span>
//               )}
//             </div>
//           )}

//           <div style={{ display: "flex", flexDirection: "column-reverse" }}>
//             <input
//               id="in_email"
//               type="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               style={{ borderColor: errors.email ? "red" : "" }}
//             />
//             <label htmlFor="in_email">Email</label>
//             {errors.email && (
//               <span style={{ color: "red", fontSize: "14px" }}>
//                 {errors.email}
//               </span>
//             )}
//           </div>

//           <div style={{ display: "flex", flexDirection: "column-reverse" }}>
//             <input
//               id="in_password"
//               type="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               style={{ borderColor: errors.password ? "red" : "" }}
//             />
//             <label htmlFor="in_password">Password</label>
//             {errors.password && (
//               <span style={{ color: "red", fontSize: "14px" }}>
//                 {errors.password}
//               </span>
//             )}
//           </div>

//           {!isLogin && (
//             <div style={{ display: "flex", flexDirection: "column-reverse" }}>
//               <input
//                 id="in_conpassword"
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 style={{ borderColor: errors.confirmPassword ? "red" : "" }}
//               />
//               <label htmlFor="in_conpassword">Confirm Password</label>
//               {errors.confirmPassword && (
//                 <span style={{ color: "red", fontSize: "14px" }}>
//                   {errors.confirmPassword}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <button type="submit" disabled={isLoading}>
//           {isLoading
//             ? isLogin
//               ? "Logging in..."
//               : "Registering..."
//             : isLogin
//             ? "Login"
//             : "Register"}
//         </button>

//         <div style={{ margin: "20px 0", textAlign: "center" }}>
//           <span>or</span>
//         </div>

//         <button
//           type="button"
//           onClick={handleGoogleSignIn}
//           disabled={isLoading}
//           style={{
//             backgroundColor: "#db4437",
//             color: "white",
//             border: "none",
//             padding: "10px 20px",
//             borderRadius: "4px",
//             cursor: "pointer",
//             width: "100%",
//           }}
//         >
//           {isLoading ? "Signing in..." : "Sign in with Google"}
//         </button>
//       </form>
//     </div>
//   );
