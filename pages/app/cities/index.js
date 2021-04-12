import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import Api from "../../../src/api";
import CitiesModal from "../../../src/components/modals/CitiesModal";

const Index = () => {
  const [inputValues, setInputValues] = useState({
    id: "",
    city: "",
    region: ""
  });
  const [id, setId] = useState("");

  const [type, setType] = useState("");
  const [cities, setCities] = useState([]);
  const [citiesModal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // component did mount
  useEffect(() => {
    _getAllCities();
  }, []);

  const _getAllCities = () => {
    Api.Cities.all().then(res => {
      console.log("_getAllCities", res);
      if (res.statusCode === 200) {
        console.log(res, "res");
        setCities(res.data);
      }
    });
  };

  const _addCity = data => {
    console.log("data", data);
    Api.Cities.add(data).then(res => {
      console.log("_addCity", res);
      if (res.statusCode === 201) {
        console.log(_addCity, "res");
        _getAllCities();
      }
    });
  };

  const _updateCity = data => {
    console.log("data", data);
    const newData = {
      city_id: data.id,
      city: data.city,
      region: data.region
    };
    Api.Cities.update(newData).then(res => {
      console.log("_updateCity", res);
      if (res.statusCode === 200) {
        console.log(_updateCity, "res");
        _getAllCities();
      }
    });
  };

  const edit = item => {
    // we need this to show it inside the input of the modal
    const id = item.id;
    const city = item.city;
    const region = item.region;
    setId(id);
    setInputValues({
      id,
      city,
      region
    });
    setType("edit");
    setModalTitle("تعديل");
    setModal(true);
  };

  const add = () => {
    setType("add");
    setModalTitle("اضافه");
    setModal(true);
  };

  const handleCityChange = e => {
    setInputValues({ ...inputValues, city: e.target.value });
  };

  const handleRegionChange = e => {
    setInputValues({ ...inputValues, region: e.target.value });
  };

  const handleSubmit = () => {
    if (type === "add") {
      if (inputValues.city !== "" || inputValues.region !== "") {
        _addCity(inputValues);
      }
    } else {
      const city = inputValues.city;
      const region = inputValues.region;
      setInputValues({
        id: id,
        city,
        region
      });

      _updateCity(inputValues);
    }
    setInputValues({
      city: "",
      region: ""
    });
    setModal(false);
  };

  return (
    <Container>
      <Layout>
        {citiesModal && (
          <CitiesModal
            cancel={() => setModal(false)}
            title={modalTitle}
            type={type}
            id={id}
            inputValues={inputValues}
            handleSubmit={handleSubmit}
            handleCityChange={handleCityChange}
            handleRegionChange={handleRegionChange}
          />
        )}

        <SectionTitle title='إدارة التطبيق' subtitle='إدارة المدن' />

        <button
          className='btn btn-default btn-pink rounded-full btn-icon mr-1 ml-1 w-1/12'
          onClick={() => add()}>
          اضافة مدينه
        </button>

        <table className='table table-lg striped'>
          <thead>
            <tr>
              <th>
                <strong>المدينه</strong>
              </th>
              <th>
                <strong>المنطقه</strong>
              </th>
              <th>{""}</th>
            </tr>
          </thead>
          <tbody>
            {cities &&
              cities.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.city}</td>
                    <td>{item.region}</td>

                    <th>
                      <button
                        className='float-right btn btn-default btn-indigo rounded-full btn-icon mr-1 ml-1 w-22'
                        onClick={() => edit(item)}>
                        <span>تعديل</span>
                      </button>
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Layout>
    </Container>
  );
};

export default Index;
