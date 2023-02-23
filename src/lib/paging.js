export async function getPaging(total, page, size) {
  const limit = size;
  const offset = (page - 1) * limit;
  const pages = Math.ceil(total / limit);
  const currentPage = page > pages ? pages : page;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < pages ? currentPage + 1 : null;

  return {
    limit,
    offset,
    pages,
    currentPage,
    prevPage,
    nextPage,
  };
}

export default getPaging();