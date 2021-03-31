import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import LoadingModal from "../../../src/components/modals/LoadingModal";
import Datatable from "../../../src/components/datatable";
import Widget from "../../../src/components/widget";
import Modal from '../../../src/components/modals'
import Link from 'next/link'
import Api from "../../../src/api";
import { useRouter } from "next/router";
import { NotificationManager } from 'react-notifications'

const Simple = ({ categories, deleteCat }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "الصورة",
        accessor: "image_path",
        Cell: props => {
          return (
            <div className='flex justify-center'>
              <img
                src={props.row.original.image_path}
                alt='image'
                className={`w-20 shadow rounded max-w-full border-none`}
              />
            </div>
          );
        }
      },
      {
        Header: "التصنيف",
        accessor: "type_name"
      },
      {
        Header: "الوصف",
        accessor: "type_desc",
        Cell: props => {
          return (
            <div>
              <p className='max-w-2xl truncate' >{props.row.original.type_desc}</p>
            </div>
          );
        }
      },
      {
        Header: "ادوات",
        Cell: props => {
          return (
            <div className='text-right'>
              <Link href={"/app/categories/edit/"+props.row.original.id} >
                <a className="float-right btn btn-default btn-blue rounded-full btn-icon inline-block w-24 mx-1">
                  <i className="icon-note font-bold mr-1 ml-1" />
                  تعديل
                </a>
              </Link>
              <Link href={"/app/sub-categories/"+props.row.original.id} >
                <a className="float-right btn btn-default btn-pink rounded-full btn-icon inline-block w-30 mx-1">
                  <i className="icon-eye font-bold mr-1 ml-1" />
                    عرض الاقسام الفرعية
                </a>
              </Link>
              <button className="float-right btn btn-default btn-red rounded-full btn-icon inline-block w-24 mx-1" onClick={()=>deleteCat(props.row.original.id)} >
                <i className="icon-trash font-bold mr-1 ml-1" />
                <span>حذف</span>
              </button>
            </div>
          );
        }
      }
    ],
    []
  );
  return <Datatable columns={columns} data={categories} />;
};

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [loadingData, setLoadingData] = useState(true);
  const [catToDeleteID, setCatToDeleteID] = useState('')
  const router = useRouter();

  useEffect(() => {
    _getAllCategories();
  }, []);

  const _deleteCat = ( s_id ) => {
    setConfirmModal(true);
    setCatToDeleteID(s_id);
  }

  const _deleteCatConfirmed = () => {
    setConfirmModal(false);
    Api.Categories.delete(catToDeleteID).then((res)=>{
      console.log("res", res);
      if(res.statusCode === 202){
        _getAllCategories();
        NotificationManager.success(res.data.message, 'نجاح', 3000);
      }else{
        NotificationManager.error(res.data.message, 'عفواً', 3000);
        setTimeout(() => {
          setMessages(false);
        }, 3000);
      }
    });
  }

  const _addNew = () => {
    router.push('/app/categories/addNew');
  }

  const _getAllCategories = () => {
    Api.Categories.all().then(res => {
      console.log("_getAllCategories", res);
      if (res.statusCode === 200) {
        setCategories(res.data);
      }
    });
  };

  return (
    <Container>
      <Layout>

        {confirmModal && (
          <Modal change={()=>_deleteCatConfirmed()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف التنصيف  ؟'} options={null} />
        )}

        <div className="relative flex text-sm mb-4">
          <div className="w-10/12">
            <SectionTitle
              title='إدارة التطبيق'
              subtitle='إدارة الأقسام الرئيسية'
            />
          </div>
          <div className="customActLinks">
            <div
                className="px-10 py-3 mt-1 uppercase font-bold text-white bg-pink-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-left mr-2"
                onClick={()=> _addNew() }
            >
              <i className="icon-plus font-bold mr-1 ml-1 mt-1" />
              <span>إضافة تصنيف جديد</span>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <LoadingModal />
        ) : (
          <Widget title={" الأقسام الرئيسية ( " + categories.length + " )"}>
            <div className=''>
              <Simple categories={categories} deleteCat={_deleteCat} />
            </div>
          </Widget>
        )}
      </Layout>
    </Container>
  );
};

export default Index;
