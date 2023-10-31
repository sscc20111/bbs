import axios from 'axios';
const fetchData = async () => {
    try {
    const response = await axios.get('http://nmwoo.info/backend/backend.php');
    // console.log(response.data)
    return response.data
    } catch (error) {
    console.error('Error fetching data:', error);
    }  
};  

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     const textValue = textRef.current.value;
//     console.log(textValue)
//     try {
//     const response = await axios.post('http://nmwoo.info/backend/save_post.php', {
//         text: textValue
//     });
//     textRef.current.value = '';
//     } catch (error) {
//     console.error('Error saving post:', error);
//     }
// };

// const bbs_delete = async (id) => {
//     try {
//     // DELETE 요청을 보냅니다.
//     const response = await axios.post('http://nmwoo.info/backend/delete_post.php', {
//         id: id
//     });
//     if (response.status === 204) {
//         // 성공적으로 삭제되었을 경우 상태 업데이트를 통해 데이터를 갱신합니다.
//         const newData = data.filter(item => item.id !== id);
//         setData(newData);
//     }
//     } catch (error) {
//     console.error('Error deleting item:', error);
//     }
// };

export default fetchData 
// export {handleSubmit, bbs_delete}