import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import api from "../../../src/api";
import CardsModal from "../../../src/components/modals/CardsModal";
import DeleteModal from "../../../src/components/modals/DeleteModal";

const Index = () => {
  const [cards, setCards] = useState([]);
  const [id, setId] = useState("");
  const [type, setType] = useState("");

  const [cardsModal, setCardsModal] = useState(false);
  const [cardsModalTitle, setCardsModalTitle] = useState("");
  const [inputValues, setInputValues] = useState({
    id: "",
    card_type: 1,
    file: ""
  });

  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState("");
  const [error, setError] = useState(false);

  // component did mount
  useEffect(() => {
    _getAllCards();
  }, []);

  const _getAllCards = () => {
    api.Cards.all().then(res => {
      console.log("_getAllCards", res);
      if (res.statusCode === 200) {
        console.log(res, "res");
        setCards(res.data);
      }
    });
  };

  const add = () => {
    setType("add");
    setCardsModalTitle("حددالمناسبه واضف الصوره");
    setCardsModal(true);
    setError(false);
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setInputValues({ ...inputValues, file: file });
  };

  const handleCardTypeChange = e => {
    setInputValues({ ...inputValues, card_type: Number(e.target.value) });
  };
  const handleSubmit = e => {
    e.preventDefault();

    if (inputValues.file === "") {
      setError(true);
    } else {
      if (!inputValues.id) {
        {
          var formdata = new FormData();
          formdata.append("card_type", inputValues.card_type);
          formdata.append("images", inputValues.file);

          api.Cards.add(formdata).then(res => {
            console.log("_getAllCards", res);
            if (res.statusCode === 201) {
              _getAllCards();
            }
          });
        }
      } else {
        const copyOfCards = cards.filter(card => card.id !== id);
        const newCards = [...copyOfCards, inputValues];
        setInputValues(newCards);
        const data = {
          id: inputValues.id,
          card_type: inputValues.card_type
        };
        api.Cards.update(data).then(res => {
          console.log("_getAllCards", res);
          if (res.statusCode === 200) {
            _getAllCards();
          }
        });
      }

      setInputValues({
        id: "",
        card_type: 1,
        file: ""
      });
      setCardsModal(false);
      setError(false);
    }
  };

  const deleteCard = card => {
    const id = card.id;
    setId(id);
    setDeleteModalTitle("حذف");
    setDeleteModal(true);
    setDeleteModalMessage("هل انت متاكد تريد الحذف؟");
  };

  const confirmDelete = () => {
    //call api
    api.Cards.delete(id).then(res => {
      if (res.statusCode === 200) {
        console.log("deleted");
        _getAllCards();
      }
      setDeleteModal(false);
    });
  };

  const edit = card => {
    const id = card.id;
    const card_type = card.card_type;
    const file = card.img_path;
    setId(id);
    setInputValues({
      id,
      card_type,
      file
    });
    setType("edit");
    setCardsModalTitle("تعديل");
    setCardsModal(true);
  };

  const deleteImage = () => {
    let file = "";
    setInputValues({ ...inputValues, file: file });
  };

  const cardTypes = [
    { name: "دعوة زفاف", id: 1 },
    { name: "عيد ميلاد", id: 2 },
    { name: "حفل خطوبه", id: 3 },
    { name: "حفل تخرج", id: 4 },
    { name: "دعوة عامه", id: 5 }
  ];
  const getCardName = cardType => {
    // here u do ur filter based on ur param (cardType)and return the name

    const nameArray = cardTypes.filter(item => item.id === cardType);
    return nameArray[0] && nameArray[0].name;
  };

  return (
    <Container>
      <Layout>
        <SectionTitle title='إدارة التطبيق' subtitle='كروت الدعوة' />
        {cardsModal && (
          <CardsModal
            cancel={() => setCardsModal(false)}
            type={type}
            title={cardsModalTitle}
            handleImageChange={e => handleImageChange(e)}
            handleCardTypeChange={e => handleCardTypeChange(e)}
            handleSubmit={handleSubmit}
            inputValues={inputValues}
            cards={cards}
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
          اضافة كرت دعوه
        </button>
        <div className='flex flex-wrap  justify-start '>
          {cards &&
            cards.map(card => {
              return (
                <div
                  key={card.id}
                  className='overflow-hidden border bg-white rounded-lg shadow-lg m-10 w-full sm:w-2/3 md:w-1/4 flex flex-col p-3'>
                  <img
                    className='bg-center object-cover w-full  h-48 '
                    src={card.img_path}
                  />
                  <div>
                    <h1 className='mb-4 text-2xl'>{card.promo_text}</h1>
                    <h2 className='mb-4 text-grey-darker text-sm flex-1'>
                      <span> {getCardName(card.card_type)} </span>
                    </h2>

                    <div className='flex flex-row '>
                      <button
                        onClick={() => deleteCard(card)}
                        className='btn btn-default btn-red rounded-full btn-icon mr-1 ml-1 w-1/2'>
                        <i className='icon-trash font-bold mr-1 ml-1' />
                      </button>
                      <button
                        onClick={() => edit(card)}
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
