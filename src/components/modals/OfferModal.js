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

const ModalBody = prop => {
  if (prop.type === "edit") {
    return (
      <form className=' p-4 flex-auto'>
        {prop.error && (
          <div>
            <p className='text-red-600'>البيانات غير صحيحه</p>
          </div>
        )}
        <label htmlFor='offer' className='block'>
          <span className='text-sm text-default'>العرض</span>
          <input
            required
            maxlength='10'
            type='text'
            placeholder={prop.name}
            value={prop.inputValues.name}
            onChange={prop.handleNameChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='description' className='block'>
          <span className='text-sm text-default'>وصف</span>
          <input
            required
            maxlength='15'
            type='text'
            placeholder={prop.description}
            value={prop.inputValues.description}
            onChange={prop.handleDescriptionChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='fileUpload' className='block'>
          <span className='text-sm text-default'>اضف صورة العرض</span>
          {!prop.inputValues.file && (
            <input
              id='fileUpload'
              accept='image/*'
              type='file'
              value={prop.inputValues.file}
              onChange={prop.handleImageChange}
              className='text-sm form-input mt-1 block w-full border'
              required
            />
          )}
        </label>

        {prop.inputValues.file && (
          <div className='relative'>
            <span
              className='modal-close btn btn-transparent absolute'
              onClick={prop.deleteImage}>
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
              src={prop.inputValues.file}
            />
          </div>
        )}
      </form>
    );
  }
  return (
    <div className='relative p-4 flex-auto'>
      <form className=' p-4 flex-auto'>
        {prop.error && (
          <div>
            <p className='text-red-600'>البيانات غير صحيحه</p>
          </div>
        )}
        <label htmlFor='offer' className='block'>
          <span className='text-sm text-default'>العرض</span>
          <input
            required
            maxlength='10'
            type='text'
            value={prop.inputValues.name}
            onChange={prop.handleNameChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='description' className='block'>
          <span className='text-sm text-default'>وصف</span>
          <input
            maxlength='15'
            required
            type='text'
            value={prop.inputValues.description}
            onChange={prop.handleDescriptionChange}
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='fileUpload' className='block'>
          <span className='text-sm text-default'>اضف صورة العرض</span>
          {!prop.inputValues.file && (
            <input
              id='fileUpload'
              accept='image/*'
              type='file'
              value={prop.inputValues.file}
              onChange={prop.handleImageChange}
              className='text-sm form-input mt-1 block w-full border'
              required
            />
          )}
        </label>
        {prop.inputValues.file && (
          <div className='relative'>
            <span
              className='modal-close btn btn-transparent absolute'
              onClick={prop.deleteImage}>
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
              src={prop.inputValues.file}
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

const OfferModal = ({
  cancel,
  title,
  type,
  message,
  inputValues,
  handleSubmit,
  handleNameChange,
  handleDescriptionChange,
  handleImageChange,
  deleteImage,
  error
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
              handleNameChange={handleNameChange}
              handleDescriptionChange={handleDescriptionChange}
              handleImageChange={handleImageChange}
              type={type}
              deleteImage={deleteImage}
              error={error}
            />
            <ModalFooter cancel={() => cancel()} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferModal;
