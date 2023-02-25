let limit = 10;

export async function paging({
  page, totalEvents, eventsLength, baseUrl=''
} = {}) {
  const offset = (page - 1) * limit;

  return {
    page,
    total: totalEvents,
    totalPages: Math.ceil(totalEvents / limit),
    first: offset === 0,
    last: eventsLength < limit,
    hasPrev: offset > 0,
    hasNext: eventsLength === limit,
    prevUrl: `${baseUrl}/?page=${page - 1}`,
    nextUrl: `${baseUrl}/?page=${page + 1}`,
  };
}

export function setPagenumber(page) {
  const num = Number(page);

  console.log('page:', page);
  console.log('num:', num);

  if (Number.isNaN(num) || !Number.isInteger(num) || num < 1) {
    return 1;
  }

  return num;
}
