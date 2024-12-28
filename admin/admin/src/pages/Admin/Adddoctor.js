import React, { useContext, useState, useEffect } from "react";
import toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { AdminContext } from "../../context/Admincontext";
import { assets } from "../../assets/assets_admin/assets";

const AddDoctor = () => {
  const [docemg, setDocemg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  const { backendurl, atoken } = useContext(AdminContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(e.target.value)
    try {
      if (!docemg) {
        toastify({
          text: "Image not selected",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "red" },
        }).showToast();
        return;
      }

      if (!name || !email || !password || !fees || !degree) {
        toastify({
          text: "Please fill out all required fields",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "orange" },
        }).showToast();
        return;
      }

      const formData = new FormData();
      formData.append("docemg", docemg);
      // formData.append('docemg', selectedFile);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formData.append("speciality", speciality);

      const response = await fetch(`${backendurl}/api/admin/add-doctor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${atoken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setDocemg('')
        setName('')
        setEmail('')
        setPassword('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
        toastify({
          text: "Doctor added successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "green" },
        }).showToast();
      } else {
        const errorData = await response.json();
        console.log("Response error:", errorData);
        toastify({
          text: "Failed to add doctor",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "red" },
        }).showToast();
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      toastify({
        text: "An error occurred",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "red" },
      }).showToast();
    }
  };

  useEffect(() => {
    return () => {
      if (docemg) {
        URL.revokeObjectURL(docemg);
      }
    };
  }, [docemg]);

  return (
    <form
    method="POST"
    action="/api/admin/add-doctor"
    encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg"
    >
      <h2 className="text-lg font-medium mb-4 text-gray-700">Add Doctor</h2>
      <div className="space-y-4">
        {/* Upload Doctor Picture */}
        <div className="flex items-start space-x-3">
          <label
            htmlFor="doc-img"
            className="w-16 h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-full cursor-pointer hover:border-gray-400"
          >
            <img
              src={docemg ? URL.createObjectURL(docemg) : assets.upload_area}
              alt="Upload Icon"
              className="w-8"
            />
          </label>
          <input
            type="file"
            id="doc-img"
            name="docemg"
            hidden
            onChange={(e) => setDocemg(e.target.files[0])}
          />
          <p className="text-xs text-gray-500">
            Upload doctor <br />
            picture
          </p>
        </div>

        {/* Doctor Name */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Doctor Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            required
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Doctor Email */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Doctor Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Doctor Password */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Doctor Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Experience</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
            required
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={`${i + 1} Year`}>
                {i + 1} Year
              </option>
            ))}
          </select>
        </div>

        {/* Fees */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Fees</label>
          <input
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            type="number"
            placeholder="Fees"
            required
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Speciality */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Speciality</label>
          <select
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
          </select>
        </div>

        {/* Education */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Education</label>
          <input
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            type="text"
            placeholder="Education"
            required
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Address</label>
          <div className="space-y-2">
            <input
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              type="text"
              placeholder="Address 1"
              required
              className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
            <input
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              type="text"
              placeholder="Address 2"
              required
              className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* About */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="About the doctor"
            required
            rows="3"
            className="w-full border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          ></textarea>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;



