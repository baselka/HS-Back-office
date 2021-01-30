import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import Api from "../../../src/api";
import Modal from "../../../src/components/modals";

const Index = () => {
  const [cities, setCities] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
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

  const deleteCity = item => {
    setModalTitle("حذف");
    setModalMessage("هل انت متاكد تريد الحذف؟");
    setModal(true);
  };

  const editCity = () => {
    setModalTitle("تعديل");
    setModalMessage("لا تستطيع التعديل!!!");
    setModal(true);
  };

  return (
    <Container>
      <Layout>
        {modal && (
          <Modal
            cancel={() => setModal(false)}
            title={modalTitle}
            message={modalMessage}
            options={modalOptions}
          />
        )}
        <SectionTitle title='إدارة التطبيق' subtitle='إدارة المدن' />

        <button className='btn btn-default btn-pink btn-rounded btn-icon mr-1 ml-1 w-1/12'>
          اضافة مدينه
        </button>

        <table className='table table-lg'>
          <thead>
            <tr>
              <th>
                <strong>المدينه</strong>
              </th>
              <th>
                <strong>المنطقه</strong>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cities &&
              cities.map((item, i) => {
                return (
                  <tr key={i}>
                    <th>{item.city}</th>
                    <th>{item.region}</th>

                    <th>
                      <button
                        className='float-right btn btn-default btn-red btn-rounded btn-icon mr-1 ml-1 w-22'
                        onClick={() => deleteCity(item)}>
                        <i className='icon-trash font-bold mr-1 ml-1' />
                        <span>حذف</span>
                      </button>
                      <th>
                        <button
                          className='float-right btn btn-default btn-indigo btn-rounded btn-icon mr-1 ml-1 w-22'
                          onClick={() => editCity(item)}>
                          <span>تعديل</span>
                        </button>
                      </th>
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
