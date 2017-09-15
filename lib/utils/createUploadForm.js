const validImageTypes = [
  'image/bmp',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/x-tiff'
]

const validVideoTypes = [
  'video/mp4',
  'video/avi',
  'video/msvideo',
  'video/x-msvideo',
  'video/avs-video',
  'video/x-dv',
  'video/mpeg',
  'video/x-motion-jpeg',
  'video/quicktime'
]

const createUploadForm = (   
    items = [], 
    options,
    allowedFileTypes ) => {

  const validTypes = allowedFileTypes ? 
    allowedFileTypes.reduce((p,v) => 
      v === 'image' ? [...p, ...validImageTypes] :
      v === 'video' ? [...p, ...validVideoTypes] :
      [...p, v], []) : null;

  const isValidType = item => !validTypes || (item.type && validTypes.indexOf(item.type) !== -1);

  const validItems = Array.from(items).filter(v => isValidType(v));

  console.log(validItems);

  const formData = new FormData();

  validItems.forEach((v, index) => formData.append(`file_${index}`, v));

  if (typeof options === 'object') {
    const optionsKeys = Object.keys(options).forEach(k => formData.append(k, options[k]));
  }

  const totalSize = validItems.reduce((size, item) => size + item.size, 0);
  const files = validItems.map(item => ({
    url: URL.createObjectURL(item),
    quota: item.size / totalSize
  }))

  return {
    formData,
    files
  }
}

export default createUploadForm
