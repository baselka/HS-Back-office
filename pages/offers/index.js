import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Container from "../Container";
import Layout from "../../src/layouts";
import SectionTitle from "../../src/components/section-title";
import OfferModal from "../../src/components/modals/AddsModal";
import DeleteModal from "../../src/components/modals/DeleteModal";

const Index = () => {
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [offers, setOffers] = useState([]);
  const [offerModal, setOfferModal] = useState(false);
  const [offermodalTitle, setOfferModalTitle] = useState("");
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

  const add = () => {
    setType("add");
    setOfferModalTitle("اضف عرضك");
    setOfferModal(true);
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
          setOffers([...offers, valuesWithId]);
        }
      } else {
        const copyOfOffers = offers.filter(offer => offer.id !== id);
        const name = inputValues.name;
        const description = inputValues.description;
        setInputValues({
          id: id,
          name,
          description
        });
        const newOffers = [...copyOfOffers, inputValues];
        setOffers(newOffers);
      }

      setInputValues({
        id: "",
        name: "",
        description: "",
        file: null
      });
      setOfferModal(false);
      setError(false);
    }
  };

  const deleteCard = offer => {
    const id = offer.id;
    setId(id);
    setDeleteModalTitle("حذف");
    setDeleteModal(true);
    setDeleteModalMessage("هل انت متاكد تريد الحذف؟");
  };

  const confirmDelete = () => {
    const newOffers = offers.filter(offer => offer.id !== id);
    setOffers(newOffers);
    setDeleteModal(false);
  };

  const edit = offer => {
    const id = offer.id;
    const name = offer.name;
    const description = offer.description;
    const file = offer.file;
    setId(id);
    setInputValues({
      id,
      name,
      description,
      file
    });
    setType("edit");
    setOfferModalTitle("تعديل");
    setOfferModal(true);
  };
  console.log(offers, "offers");

  const deleteImage = () => {
    let file = null;
    setInputValues({ ...inputValues, file: file });
  };
  return (
    <Container>
      <Layout>
        <SectionTitle title='إدارة الإعلانات والعروض' subtitle='إدارة العروض' />

        {offerModal && (
          <OfferModal
            cancel={() => setOfferModal(false)}
            type={type}
            title={offermodalTitle}
            handleImageChange={e => handleImageChange(e)}
            handleNameChange={handleNameChange}
            handleDescriptionChange={handleDescriptionChange}
            handleSubmit={handleSubmit}
            inputValues={inputValues}
            offers={offers}
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
          {offers &&
            offers.map(offer => {
              return (
                <div
                  key={offer.id}
                  className='overflow-hidden border bg-white rounded-lg shadow-lg m-10 w-full sm:w-2/3 md:w-1/4 flex flex-col p-3'>
                  <img
                    className='bg-center object-cover w-full  h-48 '
                    src={offer.file}
                  />
                  <div>
                    <h1 className='mb-4 text-2xl'>{offer.name}</h1>
                    <h2 className='mb-4 text-grey-darker text-sm flex-1'>
                      {offer.description}
                    </h2>
                    <div className='flex flex-row '>
                      <button
                        onClick={() => deleteCard(offer)}
                        className='btn btn-default btn-red rounded-full btn-icon mr-1 ml-1 w-1/2'>
                        <i className='icon-trash font-bold mr-1 ml-1' />
                      </button>
                      <button
                        onClick={() => edit(offer)}
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
