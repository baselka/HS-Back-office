import React, {useState} from 'react'
import {useForm} from 'react-hook-form'

const AccountSettings = () => {
  const {register, handleSubmit, watch, errors} = useForm()
  const onSubmit = data => {
    console.log(data)
  }
  const [checked, setChecked] = useState(true)

  return (
    <div className="w-full lg:w-1/3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-sm mb-4">
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">كلمة المرور الحالية</span>
            <input
              name="currentpassword"
              type="password"
              ref={register({required: true})}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="********"
            />
          </label>
          {errors.currentpassword && (
            <p className="mt-1 text-xs text-red-500">
              كلمة المرور الحالية إجبارية
            </p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">كلمة المرور الجديدة</span>
            <input
              name="newpassword"
              type="password"
              ref={register({required: true})}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder=""
            />
          </label>
          {errors.newpassword && (
            <p className="mt-1 text-xs text-red-500">
              كلمة المرور الجديدة اجبارية
            </p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">تأكيد كلمة المرور الجديدة</span>
            <input
              name="confirmnewpassword"
              type="password"
              ref={register({required: true})}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder=""
            />
          </label>
          {errors.confirmnewpassword && (
            <p className="mt-1 text-xs text-red-500">
              تأكيد كلمة المرور الجديدة اجباري
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="px-4 py-2 uppercase font-bold text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:outline-none active:outline-none"
            value="تحديث"
          />
        </div>
      </form>
    </div>
  )
}

export default AccountSettings
