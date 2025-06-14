function timeAgo(timestamp) {
  const now = new Date();
  const timeDifference = now - new Date(timestamp); // tính khoảng cách giữa thời gian hiện tại và timestamp

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return `${seconds} giây trước`; // nếu ít hơn 1 phút
  } else if (minutes < 60) {
    return `${minutes} phút trước`; // nếu ít hơn 1 giờ
  } else if (hours < 24) {
    return `${hours} giờ trước`; // nếu ít hơn 1 ngày
  } else if (days < 30) {
    return `${days} ngày trước`; // nếu ít hơn 1 tháng
  } else if (months < 12) {
    return `${months} tháng trước`; // nếu ít hơn 1 năm
  } else {
    return `${years} năm trước`; // nếu trên 1 năm
  }
}
export function formatDateFromLong(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, đảm bảo 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng, thêm 1 do tháng bắt đầu từ 0
  const year = date.getFullYear(); // Lấy năm

  return `${day} / ${month} / ${year}`;
}

export default timeAgo;
