import React, { useState, useEffect } from 'react'
import Container from '../Container'
import Layout from '../../src/layouts'
import SectionTitle from '../../src/components/section-title'
import LoadingModal from '../../src/components/modals/LoadingModal'
import Datatable from '../../src/components/datatable'
import { NotificationManager } from 'react-notifications'
import Widget from '../../src/components/widget'
import Api from '../../src/api'
import Modal from '../../src/components/modals'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Simple = ( { users, updatePassword, deleteUser } ) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'الاسم',
        accessor: 'full_name',
      },
      {
        Header: 'اسم المستخدم',
        accessor: 'username',
      },
      {
        Header: 'نوع الحساب',
        accessor: 'acc_name',
      },
      {
        Header: 'البريد الالكتروني',
        accessor: 'email'
      },
      {
        Header: 'جوال',
        accessor: 'phone',
      },
      {
        Header: 'الحالة',
        accessor: 'status',
        Cell: (props) => {
          return <div className="text-center" >
            {props.row.original.status == 1 ? "فعال" : "غير مفعل"}
        </div>
        }
      },
      {
        Header: 'ادوات',
        accessor: 'id',
        Cell: (props) => {
          return <div className="flex justify-center" >
              <Link href={"/users/"+props.row.original.id} >
                <a className="float-right btn btn-default btn-blue btn-rounded btn-icon mr-1 ml-1 w-22">
                  <i className="icon-note font-bold mr-1 ml-1" />
                  تعديل
                </a>
            </Link>
            <button className="float-right btn btn-default btn-orange btn-rounded btn-icon mr-1 ml-1 w-22" onClick={()=>updatePassword(props.row.original.id)} >
              <i className="icon-lock font-bold mr-1 ml-1" />
              <span>تغيير كلمة المرور</span>
            </button>
            <button className="float-right btn btn-default btn-red btn-rounded btn-icon mr-1 ml-1 w-22" onClick={()=>deleteUser(props.row.original.id)} >
              <i className="icon-trash font-bold mr-1 ml-1" />
              <span>حذف</span>
            </button>
        </div>
        }
      }
    ],
    []
  )
  return <Datatable columns={columns} data={users} />
}

const Index = () => {
  const [users, setUsers] = useState([])
  const [confirmModal, setConfirmModal] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [userToSetID, setUserToSetID] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const router = useRouter();

  useEffect(() => {
    _getUsersList()
  }, [])

  const _getUsersList = () => {
    let data = {
      start: 0,
      end: 1000
    }
    Api.Users.all(data).then((res)=>{
      if(res.statusCode === 200){
        setUsers(res.data);
        setLoadingData(false);
      }else{
        setLoadingData(false);
        NotificationManager.error('حدث خطأ اثناء استرجاع البيانات', 'عفواً', 3000);
      }
    });
  }

  const _deleteUser = ( id ) => {
    setConfirmModal(true);
    setUserToSetID(id);
  }

  const _updatePassword = ( id ) => {
    setConfirmModal(true);
    setUserToSetID(id);
    setHasInput(true);
  }

  const _confirmUpdatePassword = () => {
    if(newPwd && newPwd.length > 5){
      Api.Users.changePassword({id:userToSetID, pwd:newPwd}).then((res)=>{
        setLoadingData(false);
        setHasInput(false);
        if(res.statusCode === 202){
          NotificationManager.success('تم تغيير كلمة مرور المستخدم', 'نجاح', 3000);
        }else{
          NotificationManager.error(res.data.message, 'عفواً', 3000);
        }
      });
    }else{
      setLoadingData(false);
      setHasInput(false);
      NotificationManager.error('كلمة المرور الجديدة لاتحقق الشروط المطلوبة', 'عفواً', 3000);
    }
  }

  const _deleteUserConfirmed = () => {
    setConfirmModal(false);
    setLoadingData(true);
    if(hasInput){
      _confirmUpdatePassword();
    }else{
      Api.Users.delete( userToSetID ).then((res)=>{
        setLoadingData(false);
        if(res.statusCode === 202){
          _getUsersList();
          NotificationManager.success('تم حذف المستخدم', 'نجاح', 3000);
        }else{
          NotificationManager.error(res.data.message, 'عفواً', 3000);
        }
      });
    }
  }

  const _cancelModal = () => {
    setConfirmModal(false);
    setHasInput(false);
  }

  const _addNew = () => {
    router.push('/users/addNew');
  }

  return (
    <Container>
      { loadingData && <LoadingModal /> }
      {confirmModal && (
        <Modal change={()=>_deleteUserConfirmed()} cancel={()=>_cancelModal()} title={'تأكيد'} message={'هل تريد فعلا حذف المستخدم ؟'} options={null} hasInput={hasInput} newPwd={setNewPwd} />
      )}
      <Layout>

      <div className="flex text-sm mb-4">
          <div className="w-10/12">
            <SectionTitle title="إدارة المستخدمين" subtitle="هنا يمكنك إدارة مستخدمي التطبيق" />
          </div>
          <div className="w-2/12">
            <button className="btn btn-default btn-pink btn-rounded btn-icon float-left ml-10 mt-3" onClick={()=>_addNew()} >
              <i className="icon-plus font-bold mr-1 ml-1" />
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>
        </div>

        { users.length > 0 ? (
          <Widget title={"قائمة المستخدمين ( "+ users.length + " )"} >
            <div className="">
              <Simple users={users} updatePassword={_updatePassword} deleteUser={_deleteUser} />
            </div>
          </Widget>
        ): null }
      </Layout>
    </Container>
  )
}

export default Index
