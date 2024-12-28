import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userdata, setUserdata, backendurl, token, loaduserprofiledata }=useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userUpdateProfileData = async () => {
    try {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append("name", userdata.name);
      formdata.append("phone", userdata.phone);
      formdata.append("gender", userdata.gender);
      formdata.append("address", JSON.stringify(userdata.address));
      formdata.append("dob", userdata.dob);

      if (image) {
        formdata.append("image", image);
      }
      const { data } = await axios.post(
        `${backendurl}/api/user/profile-update`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsLoading(false);

      if (data.success) {
        toast.success(data.message);

        // Update userdata
        if (data.updatedUser) {
          setUserdata(data.updatedUser);
        }

        // Reload profile data if function exists
        if (typeof loaduserprofiledata === "function") {
          await loaduserprofiledata();
        } else {
          console.error("loaduserprofiledata is not defined.");
        }

        setEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during profile update:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  return (
    userdata && (
      <div className="flex justify-start min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full mx-auto">
          {/* Profile Image Section */}
          <div className="relative w-24 h-24 mb-4 mx-auto">
            {edit ? (
              <label htmlFor="image" className="cursor-pointer">
                <img
                  src={image ? URL.createObjectURL(image) : `${backendurl}${userdata.image}`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
            ) : (
              <img
                src={`${backendurl}${userdata.image}`}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            )}

            {/* Name Edit */}
            {edit ? (
              <input
                type="text"
                value={userdata.name}
                onChange={(e) =>
                  setUserdata((prev) => ({ ...prev, name: e.target.value }))
                }
                className="text-sm font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 mt-2 w-full text-center"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800 text-center">
                {userdata.name}
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 text-sm mb-3">Contact Information</h3>
            <div className="space-y-4 text-gray-600 text-sm">
              <p>
                <span className="font-semibold">Email:</span> {userdata.email}
              </p>
              <div>
                <label className="block font-semibold mb-1">Phone:</label>
                {edit ? (
                  <input
                    type="text"
                    value={userdata.phone}
                    onChange={(e) =>
                      setUserdata((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p>{userdata.phone}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1">Address:</label>
                {edit ? (
                  <div>
                    <input
                      type="text"
                      value={userdata.address.line1}
                      onChange={(e) =>
                        setUserdata((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line1: e.target.value,
                          },
                        }))
                      }
                      className="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={userdata.address.line2}
                      onChange={(e) =>
                        setUserdata((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line2: e.target.value,
                          },
                        }))
                      }
                      className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p>
                    {userdata.address.line1}
                    <br />
                    {userdata.address.line2}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 text-sm mb-3">Basic Information</h3>
            <div className="space-y-4 text-gray-600 text-sm">
              <div>
                <label className="block font-semibold mb-1">Gender:</label>
                {edit ? (
                  <select
                    value={userdata.gender}
                    onChange={(e) =>
                      setUserdata((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                ) : (
                  <p>{userdata.gender}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1">Birthday:</label>
                {edit ? (
                  <input
                    type="date"
                    value={userdata.dob}
                    onChange={(e) =>
                      setUserdata((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p>{userdata.dob}</p>
                )}
              </div>
            </div>
          </div>

          {/* Save/Edit Button */}
          <div className="flex justify-center">
            {edit ? (
              <div className="flex space-x-4">
                <button
                  onClick={userUpdateProfileData}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Information"}
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEdit(true)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;



