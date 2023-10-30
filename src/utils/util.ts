//文件流导出数据处理
export const downLoadxls = (res, fileName) => {
  let name = fileName
  if (res.headers['content-disposition']) {
    const contentDisposition = res.headers['content-disposition'].split('=')
    name = (contentDisposition && decodeURI(contentDisposition[1])) || ''
  }
  const file = new File([res.data], name, res.data)
  const href = URL.createObjectURL(file)
  const aTag = document.createElement('a')
  aTag.download = file.name
  aTag.target = '_blank'
  aTag.href = href
  aTag.click()
  URL.revokeObjectURL(href)
}

//本地文件下载  下载的模板文件放在public下的file文件夹中
export const downFile = (fileName) => {
  const anchor = document.createElement('a')
  anchor.href = `file/${fileName}`
  anchor.setAttribute('download', fileName)
  anchor.innerHTML = 'downloading...'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  setTimeout(() => {
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => {
      self.URL.revokeObjectURL(anchor.href)
    }, 250)



  }, 66)
}

//本地文件下载-自定义文件名
export const downFileNew = (fileName, name) => {
  const anchor = document.createElement('a')
  anchor.href = `${process.env.BASE_URL}static/file/${fileName}`
  anchor.download = name
  // anchor.setAttribute('download', name)
  anchor.innerHTML = 'downloading...'
  anchor.style.display = 'none'
  console.log('anchor', anchor)
  document.body.appendChild(anchor)
  setTimeout(() => {
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => {
      console.log(123, anchor)
      self.URL.revokeObjectURL(anchor.href)
    }, 250)
  }, 66)
}
