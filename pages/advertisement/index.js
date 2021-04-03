import React, { useState, useEffect } from "react";
import Container from "../Container";
import Layout from "../../src/layouts";
import SectionTitle from "../../src/components/section-title";
import { v4 as uuidv4 } from "uuid";

import AddsModal from "../../src/components/modals/AddsModal";
import DeleteModal from "../../src/components/modals/DeleteModal";
import api from "../../src/api";

const Index = () => {
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [adds, setadds] = useState([]);
  const [addsModal, setAddsModal] = useState(false);
  const [addsModalTitle, setaddsModalTitle] = useState("");
  const [inputValues, setInputValues] = useState({
    id: "",
    name: "",
    description: "",
    file: ""
  });

  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState("");
  const [error, setError] = useState(false);

  // component did mount
  useEffect(() => {
    _getAllAds();
  }, []);

  const _getAllAds = () => {
    api.Promos.all().then(res => {
      console.log("_getAllAds", res);
      if (res.statusCode === 200) {
        console.log(res, "res");
        setadds(res.data);
      }
    });
  };
  // const { image, ad_text, branch_id, redirect_url, start_date, end_date } = req.body;

  const add = () => {
    setType("add");
    setaddsModalTitle("اضف عرضك");
    setAddsModal(true);
    setError(false);
  };

  const handleImageChange = e => {
    const file = URL.createObjectURL(e.target.files[0]);
    setInputValues({ ...inputValues, file: file });
  };

  const handleNameChange = e => {
    setInputValues({ ...inputValues, name: e.target.value });
  };

  const handleDescriptionChange = e => {
    setInputValues({ ...inputValues, description: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (
      inputValues.name === "" ||
      inputValues.description === "" ||
      inputValues.file === ""
    ) {
      setError(true);
    } else {
      if (type === "add") {
        {
          let valuesWithId = { ...inputValues, id: uuidv4() };
          setadds([...adds, valuesWithId]);
        }
      } else {
        const copyOfadds = adds.filter(add => add.id !== id);
        const name = inputValues.name;
        const description = inputValues.description;
        setInputValues({
          id: id,
          name,
          description
        });
        const newadds = [...copyOfadds, inputValues];
        setadds(newadds);
      }

      setInputValues({
        id: "",
        name: "",
        description: "",
        file: null
      });
      setAddsModal(false);
      setError(false);
    }
  };

  const deleteAdd = add => {
    const id = add.id;
    setId(id);
    setDeleteModalTitle("حذف");
    setDeleteModal(true);
    setDeleteModalMessage("هل انت متاكد تريد الحذف؟");
  };

  const confirmDelete = () => {
    const newadds = adds.filter(add => add.id !== id);
    setadds(newadds);
    setDeleteModal(false);
  };

  const edit = add => {
    const id = add.id;
    const name = add.name;
    const description = add.description;
    const file = add.file;
    setId(id);
    setInputValues({
      id,
      name,
      description,
      file
    });
    setType("edit");
    setaddsModalTitle("تعديل");
    setAddsModal(true);
  };
  console.log(adds, "adds");

  const deleteImage = () => {
    let file = null;
    setInputValues({ ...inputValues, file: file });
  };
  return (
    <Container>
      <Layout>
        <SectionTitle
          title='إدارة الإعلانات والعروض'
          subtitle='إدارة الإعلانات'
        />

        {addsModal && (
          <AddsModal
            cancel={() => setAddsModal(false)}
            type={type}
            title={addsModalTitle}
            handleImageChange={e => handleImageChange(e)}
            handleNameChange={handleNameChange}
            handleDescriptionChange={handleDescriptionChange}
            handleSubmit={handleSubmit}
            inputValues={inputValues}
            adds={adds}
            deleteImage={() => deleteImage()}
            id={inputValues.id}
            error={error}
          />
        )}
        {deleteModal && (
          <DeleteModal
            cancel={() => setDeleteModal(false)}
            deleteConfirm={id => confirmDelete(id)}
            title={deleteModalTitle}
            message={deleteModalMessage}
            id={inputValues.id}
          />
        )}
        <button
          className='btn btn-default btn-pink rounded-full btn-icon mr-1 ml-1 sm:w-1/5  md:w-1/12  '
          onClick={() => add()}>
          اضافة عرض
        </button>
        <div className='flex flex-wrap  justify-start '>
          {adds &&
            adds.map(add => {
              return (
                <div
                  key={add.id}
                  className='overflow-hidden border bg-white rounded-lg shadow-lg m-10 w-full sm:w-2/3 md:w-1/4 flex flex-col p-3'>
                  <img
                    className='bg-center object-cover w-full  h-48 '
                    src={add.img_path}
                  />
                  <div>
                    <h1 className='mb-4 text-2xl'>{add.promo_text}</h1>
                    <h2 className='mb-4 text-grey-darker text-sm flex-1'>
                      بداية العرض{add.promo_st}
                    </h2>
                    <h2 className='mb-4 text-grey-darker text-sm flex-1'>
                      نهاية العرض{add.promo_end}
                    </h2>
                    <div className='flex flex-row '>
                      <button
                        onClick={() => deleteAdd(add)}
                        className='btn btn-default btn-red rounded-full btn-icon mr-1 ml-1 w-1/2'>
                        <i className='icon-trash font-bold mr-1 ml-1' />
                      </button>
                      <button
                        onClick={() => edit(add)}
                        className='btn btn-default btn-yellow rounded-full btn-icon mr-1 ml-1 w-1/2'>
                        <i className='icon-note font-bold mr-1 ml-1' />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Layout>
    </Container>
  );
};

export default Index;
