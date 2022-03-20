import { useEffect, useState } from "react";
import axios from "axios";
import uniqid from "uniqid";

function App() {
  const [studentsData, setStudentData] = useState([]);
  const [searchedValue, setSearchedValue] = useState("");
  const [searchedTagValue, setSearchedTagValue] = useState("");
  const [plusOrMinusValue, setPlusOrMinusValue] = useState({
    bool: false,
    id: "",
  });
  const [tags, setTags] = useState([]);
  const [tagOnChange, setTagOnChange] = useState("");

  useEffect(() => {
    axios
      .get("https://api.hatchways.io/assessment/students", {
        header: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => setStudentData(response.data.students))
      .catch((err) => console.log(err));
  }, [setStudentData]);

  return (
    <div className="App flex_centralize">
      <div className="mi_container">
        <div className="mi_input">
          <input
            type="text"
            onChange={(e) => setSearchedValue(e.target.value)}
            placeholder="Search by name"
          />
        </div>

        <div className="mi_input">
          <input
            type="text"
            onChange={(e) => setSearchedTagValue(e.target.value)}
            placeholder="Search by tag"
          />
        </div>

        {!studentsData
          ? ""
          : studentsData
              .filter((student) => {

                if (searchedValue === "" && searchedTagValue === "") {
                  return student;
                }

                if (searchedValue !== "" && searchedTagValue === "") {
                  if (
                    `${student.firstName} ${student.lastName}`
                    .toLowerCase()
                    .includes(searchedValue.toLowerCase())
                  ) {
                    return student;
                  } else {
                    return false;
                  }
                }

                if (searchedValue === "" && searchedTagValue !== "") {
                  let result = tags.find((tag) => {
                    if (
                      tag.value
                        .toLowerCase()
                        .includes(searchedTagValue.toLowerCase()) &&
                      tag._id === student.id
                    ) {
                      return student;
                    } else {
                      return false;
                    }
                  });

                  return result;
                }

                if (searchedValue !== "" && searchedTagValue !== "") {
                  if (
                    student.firstName
                      .toLowerCase()
                      .includes(searchedValue.toLowerCase()) ||
                    student.lastName
                      .toLowerCase()
                      .includes(searchedValue.toLowerCase())
                  ) {
                    return student;
                  }

                  let result = tags.find((tag) => {
                    if (
                      tag.value
                        .toLowerCase()
                        .includes(searchedTagValue.toLowerCase()) &&
                      tag._id === student.id
                    ) {
                      return student;
                    } else {
                      return false;
                    }
                  });

                  return result && student;
                } else {
                  return false;
                }
              })
              .map((student, id) => {
                return (
                  <div className="mi_card" key={student.id}>
                    <div className="mi_img flex_centralize">
                      <img src={student.pic} alt="student" />
                    </div>

                    <div className="mi_description">
                      <h3>
                        {student.firstName} {student.lastName}
                      </h3>

                      <ul>
                        <li>Email: {student.email}</li>
                        <li>Company: {student.company}</li>
                        <li>Skill: {student.skill}</li>
                        <li>
                          Average:{" "}
                          {student.grades.reduce(
                            (avg, value, _, { length }) => {
                              return avg + value / length;
                            },
                            0
                          )}
                          %
                        </li>
                      </ul>
                    </div>

                    <div className="test_scores_container">
                      <ul>
                        {plusOrMinusValue.bool === true &&
                        plusOrMinusValue.id === student.id
                          ? student.grades.map((score) => (
                              <li key={uniqid()}>
                                {" "}
                                Test {student.id} <span>{score}%</span>{" "}
                              </li>
                            ))
                          : ""}
                      </ul>

                      <div className="tag_container">
                        {tags
                          .filter((tag) => tag._id === student.id)
                          .map((tag, tag_id) => (
                            <div className="tag" key={tag_id}>
                              {tag.value}
                            </div>
                          ))}
                      </div>

                      <div className="mi_input tag_input">
                        <input
                          type="text"
                          id={id}
                          className="t_input"
                          onChange={(e) => setTagOnChange(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              setTags([
                                ...tags,
                                { _id: student.id, value: tagOnChange },
                              ]);
                              e.target.value = "";
                              setTagOnChange("");
                            }
                          }}
                          placeholder="Add a tag"
                        />
                      </div>
                    </div>

                    <span className="plus-minus">
                      {plusOrMinusValue.bool === true &&
                      plusOrMinusValue.id === student.id ? (
                        <i
                          className="fas fa-minus"
                          onClick={() =>
                            setPlusOrMinusValue({ bool: false, id: "" })
                          }
                        ></i>
                      ) : (
                        <i
                          className="fa fa-plus"
                          onClick={() =>
                            setPlusOrMinusValue({ bool: true, id: student.id })
                          }
                          aria-hidden="true"
                        ></i>
                      )}
                    </span>
                  </div>
                );
              })}
      </div>
    </div>
  );
}

export default App;
