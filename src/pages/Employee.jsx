import React, { useState, useEffect } from "react";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import axios from "axios";

function Employee() {
  toastr.options = {
    positionClass: "toast-bottom-right",
  };
  const loadStateFromLocalStorage = () => {
    const storedSearch = localStorage.getItem("search") || "";
    const storedSearchDivision = localStorage.getItem("searchDivision") || "";
    const storedCurrentPage =
      parseInt(localStorage.getItem("currentPage")) || 1;
    return {
      storedSearch,
      storedSearchDivision,
      storedCurrentPage,
    };
  };

  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [division, setDivision] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [position, setPosition] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const [paginate, setPaginate] = useState([]);

  const [search, setSearch] = useState(
    () => loadStateFromLocalStorage().storedSearch
  );
  const [searchDivision, setSearchDivision] = useState(
    () => loadStateFromLocalStorage().storedSearchDivision
  );
  const [currentPage, setCurrentPage] = useState(
    () => loadStateFromLocalStorage().storedCurrentPage
  );

  const getDivisions = async () => {
    const response = await axios.get(
      "https://aksamedia-backend.carroo.my.id/api/divisions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDivisions(response.data.data.divisions);
  };
  const getEmployees = async () => {
    setLoading(true);
    const { storedSearch, storedSearchDivision, storedCurrentPage } =
      loadStateFromLocalStorage();
    const params = {};
    if (storedSearch) {
      params.name = storedSearch;
    }
    if (storedSearchDivision) {
      params.division_id = storedSearchDivision;
    }
    if (storedCurrentPage) {
      params.page = storedCurrentPage;
    }
    console.log(storedCurrentPage);

    const response = await axios.get(
      "https://aksamedia-backend.carroo.my.id/api/employees",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );
    setEmployees(response.data.data.employees);
    setPaginate(response.data.pagination);
    setLoading(false);
  };
  const positions = ["Manager", "Programmer", "Staff"];

  useEffect(() => {
    getDivisions();
    getEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem("search", search);
    localStorage.setItem("searchDivision", searchDivision);
    getEmployees();
  }, [search, searchDivision]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("division", division);
    formData.append("position", position);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingIndex >= 0) {
        const res = await axios.post(
          `https://aksamedia-backend.carroo.my.id/api/employees/${employees[editingIndex].id}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toastr.success("Employee updated successfully!");
      } else {
        const response = await axios.post(
          "https://aksamedia-backend.carroo.my.id/api/employees",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toastr.success("Employee added successfully!");
      }
      getEmployees();
      resetForm();
    } catch (error) {
      toastr.error("Failed save!");
      console.error("Failed to save employee:", error);
    }
  };

  const handleEdit = (index) => {
    const employee = employees[index];
    setName(employee.name);
    setPhone(employee.phone);
    setDivision(employee.division.id);
    setPosition(employee.position);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const res = await axios.delete(
        `https://aksamedia-backend.carroo.my.id/api/employees/${employees[index].id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toastr.success("Employee deleted successfully!");
      getEmployees();
    } catch (error) {
      toastr.error("Failed delete!");
      console.error("Failed to delete employee:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setImage(null);
    document.getElementById("fimg").value = "";
    setDivision("");
    setPosition("");
    setEditingIndex(-1);
  };

  const paginating = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem("currentPage", pageNumber.toString());
    getEmployees();
  };

  return (
    <div className="container">
      <h2 className="text-4xl font-bold dark:text-slate-50 mt-4 mb-8 text-center">
        Data Employee
      </h2>
      <div className="flex flex-wrap ">
        <div className="w-full md:w-1/3 p-2">
          <div className="border rounded-lg p-2">
            <h4 className="text-xl font-bold text-center dark:text-slate-50 my-4">
              Form Data
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="px-4">
                <div className="flex flex-wrap mb-3">
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-700">
                    Name
                  </label>
                  <input
                    className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-wrap mb-3">
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-700">
                    Phone
                  </label>
                  <input
                    className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                    placeholder="0899"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-wrap mb-3">
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-700">
                    Image URL
                  </label>
                  <input
                    id="fimg"
                    className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="flex flex-wrap mb-3">
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-700">
                    Division
                  </label>
                  <select
                    className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions.map((div, index) => (
                      <option key={index} value={div.id}>
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap mb-3">
                  <label className="block text-sm font-medium dark:text-slate-300 text-slate-700">
                    Position
                  </label>
                  <select
                    className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos, index) => (
                      <option key={index} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center p-6">
                <button
                  className="w-full items-center justify-center rounded-md text-sm font-medium dark:bg-slate-600 bg-black dark:hover:bg-slate-700 hover:bg-black/90 text-slate-50 h-10 px-4 py-2"
                  type="submit"
                >
                  {editingIndex >= 0 ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full md:w-2/3 p-2">
          <div className="border rounded-lg p-2">
            <div className="flex justify-between m-4">
              <h4 className="text-xl font-bold dark:text-slate-50 ">
                Card Data
              </h4>
              <div className="flex gap-2">
                <input
                  className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                  placeholder="Search Name"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="w-full h-10 rounded-md border dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-black dark:text-slate-200 px-3 py-2 text-sm"
                  value={searchDivision}
                  onChange={(e) => setSearchDivision(e.target.value)}
                >
                  <option value="">All Division</option>
                  {divisions.map((div, index) => (
                    <option key={index} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <div
                    key={index}
                    className="rounded-lg border w-full max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xl"
                  >
                    <div className="p-6 grid gap-4">
                      <div className="grid gap-1">
                        {employee.image ? (
                          <img
                            src={employee.image}
                            alt={`${employee.name} Avatar`}
                            className="mx-auto rounded-full border-4 border-white dark:border-gray-800 w-32 h-32 object-cover bg-slate-300"
                          />
                        ) : (
                          <div className="mx-auto rounded-full border-4 border-white dark:border-gray-800 w-32 h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <h3 className="text-2xl font-bold text-center">
                          {employee.name.length > 10
                            ? `${employee.name.substring(0, 10)}...`
                            : employee.name}
                        </h3>
                        <p className="text-center">
                          <span className="bg-green-700 rounded-lg px-1 text-slate-50">
                            {employee.position}
                          </span>
                        </p>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            stroke="currentColor"
                            viewBox="0 0 512 512"
                            className="h-5 w-5 text-gray-400 dark:text-gray-500"
                          >
                            <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                          </svg>
                          <p>{employee.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            stroke="currentColor"
                            className="h-5 w-5 text-gray-400 dark:text-gray-500"
                            viewBox="0 0 384 512"
                          >
                            <path d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z" />
                          </svg>
                          <p>{employee.division.name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 justify-center mt-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="w-full text-sm px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-400 text-white mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="w-full text-sm px-3 py-1 rounded-md bg-red-500 hover:bg-red-400 text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {loading ? (
                    <div className="col-span-full text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <p className="text-gray-600 dark:text-gray-300 flex justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 24a12 12 0 0012-12h-4a8 8 0 01-8 8v4z"
                          ></path>
                        </svg>
                        Processing...
                      </p>
                    </div>
                  ) : (
                    <div className="col-span-full text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <p className="text-gray-600 dark:text-gray-300">
                        No employees found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-center my-4">
              {paginate.per_page < paginate.total && (
                <div>
                  <ul className="flex">
                    {(() => {
                      const pagination = []; // Array untuk menampung elemen pagination
                      for (let i = 1; i <= paginate.last_page; i++) {
                        pagination.push(
                          <li key={i}>
                            <button
                              onClick={() => paginating(i)}
                              className={`px-3 py-1 mx-1 rounded ${
                                paginate.current_page === i
                                  ? "bg-blue-700 text-white"
                                  : "bg-slate-400 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {i}
                            </button>
                          </li>
                        );
                      }
                      return pagination;
                    })()}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;
