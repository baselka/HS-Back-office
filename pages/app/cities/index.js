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
  const [error, setError] = useState(false);
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
    setError(false);
  };

  const add = () => {
    setType("add");
    setModalTitle("اضافه");
    setModal(true);
    setError(false);
  };

  const handleCityChange = e => {
    setInputValues({ ...inputValues, city: e.target.value });
  };

  const handleRegionChange = e => {
    setInputValues({ ...inputValues, region: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (inputValues.city === "" || inputValues.region === "") {
      setError(true);
    } else {
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
      setError(false);
      setModal(false);
    }
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
            error={error}
          />
        )}

        <SectionTitle title='إدارة التطبيق' subtitle='إدارة المدن' />
        <button
          className='btn btn-default btn-pink rounded-full btn-icon mr-1 ml-1 w-1/12'
          onClick={() => add()}>
          اضافة مدينه
        </button>
        <div className='flex justify-center '>
          <table className='shadow-lg bg-white '>
            <tr>
              <th className='bg-gray-100 border text-left px-10 py-8'>
                <strong>المدينه</strong>
              </th>
              <th className='bg-gray-100 border text-left px-10 py-8'>
                <strong>المنطقه</strong>
              </th>
              <th className='bg-gray-100 border text-left px-10 py-8'>{""}</th>
            </tr>

            <tbody>
              {cities &&
                cities.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className='border px-10 py-8'>{item.city}</td>
                      <td className='border px-10 py-8'>{item.region}</td>

                      <td className='border px-10 py-8'>
                        <button
                          className='float-right btn btn-default btn-indigo rounded-full btn-icon mr-1 ml-1 w-22'
                          onClick={() => edit(item)}>
                          <span>تعديل</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Layout>
    </Container>
  );
};

export default Index;
