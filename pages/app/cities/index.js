import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import Api from "../../../src/api";
import CitiesModal from "../../../src/components/modals/CitiesModal";
import DeleteModal from "../../../src/components/modals/DeleteModal";

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

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  // component did mount
  useEffect(() => {
    _getAllCities();
  }, []);

  // const _deleteCity = id => {
  //   // Api.Cities.delete(id).then(res => {
  //   //   console.log("_deleteCity", res);
  //   //   if (res.statusCode === 200) {
  //   //     console.log(res, "res");
  //   //     const newCities = cities.filter(city => city.id !== id);
  //   //     setCities(newCities);
  //   //     setDeleteModal(false);
  //   //   }
  //   // });
  // };

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
      if (res.statusCode === 200) {
        console.log(_addCity, "res");
        if (inputValues.city !== "" || inputValues.region !== "") {
          const newCity = inputValues;
          const newCities = [...cities, newCity];
          _addCity();
          setCities(newCities);
          _getAllCities();
        }
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
    // console.log("newData", newData);
    Api.Cities.update(newData).then(res => {
      console.log("_updateCity", res);
      if (res.statusCode === 200) {
        // console.log(_updateCity, "res");
        const copyOfCities = cities.filter(city => city.id !== id);
        const city = inputValues.city;
        const region = inputValues.region;
        setInputValues({
          id: id,
          city,
          region
        });
        const newCities = [...copyOfCities, inputValues];
        setCities(newCities);
        _getAllCities();
      }
    });
  };

  const confirmDelete = () => {
    const newCities = cities.filter(city => city.id !== id);
    setCities(newCities);
    setDeleteModal(false);
  };

  const remove = item => {
    const id = item.id;
    setId(id);
    setDeleteModalTitle("حذف");
    setDeleteModalMessage("هل انت متاكد تريد الحذف؟");
    setDeleteModal(true);
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

        {deleteModal && (
          <DeleteModal
            cancel={() => setDeleteModal(false)}
            deleteConfirm={() => confirmDelete(id)}
            title={deleteModalTitle}
            message={deleteModalMessage}
            id={id}
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

                    <td>
                      <button
                        className='float-right btn btn-default btn-red rounded-full btn-icon mr-1 ml-1 w-22'
                        onClick={() => remove(item)}>
                        <i className='icon-trash font-bold mr-1 ml-1' />
                        <span>حذف</span>
                      </button>
                    </td>

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
