function isValidDate(d: any): d is Date {
  //@ts-expect-error this is to verify if date  
  return d instanceof Date && !isNaN(new Date(d));
}

export default isValidDate;