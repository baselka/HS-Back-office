import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ModalHeader = ({ cancel, head }) => (
  <div className='modal-header'>
    <h4 className='text-xl font-semibold'>{head}</h4>
    <button className='modal-close btn btn-transparent' onClick={cancel}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`text-secondary stroke-current inline-block h-5 w-5`}>
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
      </svg>
    </button>
  </div>
);

const ModalBody = props => {
  const urlImage =
    !props.inputValues.file && URL.createObjectURL(props.inputValues.file);
  console.log(props, "props");
  if (props.type === "edit") {
    return (
      <form className=' p-4 flex-auto'>
        {props.error && (
          <div>
            <p className='text-red-600'>تاكد من كتابة بياناتك كامله</p>
          </div>
        )}
        <div>
          <input
            className='w-full text-lg m-2 outline-none'
            type='text'
            list='branches'
            placeholder='حدد الفرع هنا .....'
            onChange={props.handleBranchChange}
          />
          <datalist id='branches' className='w-full text-lg m-2 outline-none'>
            {props.branches.map((item, i) => {
              return <option key={i} value={item.branch_name} />;
            })}
          </datalist>
        </div>

        <label htmlFor='offer' className='block m-2'>
          <span className='text-sm text-default'>الاعلان</span>
          <input
            required
            maxLength='30'
            type='text'
            placeholder={props.inputValues.name}
            value={props.inputValues.name}
            onChange={props.handleNameChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='redirectUrl' className='block m-2'>
          <span className='text-sm text-default'>لينك الاعلان</span>
          <input
            maxLength='30'
            type='text'
            placeholder={props.inputValues.redirectUrl}
            value={props.inputValues.redirectUrl}
            onChange={props.handleRedirectUrlChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <div className='flex'>
          <div className='text-sm form-input mt-1 flex-1 w-full border'>
            <span className='text-sm text-default'>ادخل موعد بداية العرض </span>
            <label htmlFor='DatePicker' className='block m-2 w-full'>
              <DatePicker
                className='outline-none w-full'
                selected={props.startDate}
                onChange={props.startDateChange}
                minDate={new Date()}
                dateFormat='yyyy-MM-dd'
              />
            </label>
          </div>

          <div className='text-sm form-input mt-1 flex-1 w-full border'>
            <span className='text-sm text-default'>
              ادخل موعد انتهاء العرض{" "}
            </span>
            <label htmlFor='DatePicker' className='block m-2 w-full'>
              <DatePicker
                className='outline-none w-full'
                selected={props.endDate}
                onChange={props.endDateChange} //only when value has changed
                minDate={new Date()}
                dateFormat='yyyy-MM-dd'
              />
            </label>
          </div>
        </div>

        <label htmlFor='fileUpload' className='block p-4'>
          <span className='text-sm text-default'>اضف صورة الاعلان</span>
          {!props.inputValues.file && (
            <input
              id='fileUpload'
              accept='image/*'
              type='file'
              placeholder={props.inputValues.file}
              value={props.inputValues.file}
              onChange={props.handleImageChange}
              className='text-sm form-input mt-1 block w-full border'
              required
            />
          )}
        </label>

        {props.inputValues.file && (
          <div className='relative'>
            <span
              className='modal-close btn btn-transparent absolute'
              onClick={props.deleteImage}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`text-secondary stroke-current inline-block h-5 w-5`}>
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </span>
            <img
              className=' bg-center object-cover w-full  h-48 '
              src={props.inputValues.file}
            />
          </div>
        )}
      </form>
    );
  }
  return (
    <div className='relative p-4 flex-auto'>
      <form className=' p-4 flex-auto'>
        {props.error && (
          <div>
            <p className='text-red-600'> تاكد من تكملة جميع الحقول!</p>
          </div>
        )}
        <span className='text-sm text-default'>حدد الفرع</span>
        <div>
          <select
            className='text-sm form-input mt-1 block w-full border'
            onChange={props.handleDropDownChange}>
            {props.branches.map((item, i) => {
              return (
                <option
                  key={i}
                  name={item.branch_name}
                  value={item.branch_id}
                  selected={item.branch_id === props.inputValues.branch_id}>
                  {item.branch_name}
                </option>
              );
            })}
          </select>
          <input
            className='w-full text-lg'
            type='text'
            placeholder='start typing ...'
            onChange={props.handleBranchChange}
          />
        </div>
        <label htmlFor='offer' className='block'>
          <span className='text-sm text-default'>الاعلان</span>
          <input
            required
            maxLength='10'
            type='text'
            value={props.inputValues.name}
            onChange={props.handleNameChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='redirectUrl' className='block'>
          <span className='text-sm text-default'>لينك الاعلان</span>
          <input
            maxLength='30'
            type='text'
            placeholder={props.inputValues.redirectUrl}
            value={props.inputValues.redirectUrl}
            onChange={props.handleRedirectUrlChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>

        <div className='text-sm form-input mt-1 block w-full border'>
          <span className='text-sm text-default'>start_date</span>{" "}
          <DatePicker
            selected={props.startDate}
            onChange={props.startDateChange}
            minDate={new Date()}
            dateFormat='yyyy-MM-dd'
          />
        </div>
        <div className='text-sm form-input mt-1 block w-full border'>
          <span className='text-sm text-default'>end_date</span>{" "}
          <DatePicker
            selected={props.endDate}
            onChange={props.endDateChange}
            minDate={new Date()}
            dateFormat='yyyy-MM-dd'
          />
        </div>

        <label htmlFor='fileUpload' className='block'>
          <span className='text-sm text-default'>اضف صورة الاعلان</span>
          {!props.inputValues.file && (
            <input
              id='fileUpload'
              accept='image/*'
              type='file'
              value={props.inputValues.file}
              onChange={props.handleImageChange}
              className='text-sm form-input mt-1 block w-full border'
              required
            />
          )}
        </label>
        {props.inputValues.file && (
          <div className='relative'>
            <span
              className='modal-close btn btn-transparent absolute'
              onClick={props.deleteImage}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`text-secondary stroke-current inline-block h-5 w-5`}>
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </span>
            <img
              className=' bg-center object-cover w-full  h-48 '
              src={urlImage}
            />
          </div>
        )}
      </form>
    </div>
  );
};

const ModalFooter = ({ cancel, handleSubmit }) => (
  <div className='modal-footer children-x-2'>
    <button
      className='btn btn-default btn-red btn-rounded'
      type='button'
      onClick={handleSubmit}>
      تاكيد
    </button>
    <button
      className='btn btn-default btn-red btn-rounded'
      type='button'
      onClick={cancel}>
      تراجع
    </button>
  </div>
);

const AddsModal = ({
  cancel,
  title,
  type,
  message,
  inputValues,
  handleSubmit,
  handleNameChange,
  handleRedirectUrlChange,
  handleImageChange,
  handleBranchChange,
  handleDropDownChange,
  startDateChange,
  endDateChange,
  deleteImage,
  error,
  branches,
  startDate,
  endDate
}) => {
  return (
    <>
      <div className='backdrop fade-in fixed inset-0 z-40 bg-black'></div>
      <div className='modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none sm:w-auto'>
        <div className='relative w-3/12 my-4 mx-auto max-w-lg sm:w-full'>
          <div className='modal-content'>
            <ModalHeader cancel={() => cancel()} head={title} />
            <ModalBody
              body={message}
              inputValues={inputValues}
              handleBranchChange={handleBranchChange}
              handleDropDownChange={handleDropDownChange}
              handleNameChange={handleNameChange}
              handleRedirectUrlChange={handleRedirectUrlChange}
              handleImageChange={handleImageChange}
              startDateChange={date => startDateChange(date)}
              endDateChange={date => endDateChange(date)}
              type={type}
              branches={branches}
              deleteImage={deleteImage}
              error={error}
              startDate={startDate}
              endDate={endDate}
            />
            <ModalFooter cancel={() => cancel()} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddsModal;
