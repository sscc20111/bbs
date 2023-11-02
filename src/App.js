import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";
import { Flip } from 'gsap/Flip';
import { Button, Container, FloatingLabel, FormControl, Stack } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

gsap.registerPlugin(Draggable, Flip) 

const style = () => {
  const randomBetween = (min, max) => {
    return min + Math.ceil(Math.random() * max);
  };
  
  const style = 'translate(' + randomBetween(0, window.innerWidth - 150) + 'px,' + randomBetween(0, window.innerHeight - 150) + 'px) rotate(' + randomBetween(-15, 15) + 'deg)';
  return style
}

const flip = (from, to) => {
  const flipFrom = document.querySelector(from)
  const flipTo = document.querySelector(to)
  const state = Flip.getState(from + ', ' + to);
  flipFrom.classList.toggle("flipActive");
  flipTo.classList.toggle("flipActive");
  Flip.from(state, {
    duration: 0.6,
    fade: true,
    scale: true,
    absolute: true,
    toggleClass: "flipping",
    ease: "power3.inOut"
  });
}

const Note = ({ index, children, style, onRemove, drag, modify, state }) => {
    useEffect(()=>{
      Draggable.create(".note",{
        onDragEnd: function(e) {
          const target = e.target.closest('.note');
          const index = target.getAttribute('data-index');

          drag(e, target.style.transform, index)
        }
      });
    },[drag])

    const remove = () => {
        onRemove(index);
    };

    const modifyTarget = (e) => {
      const target = e.target.closest('.note')
      const modifyTarget = `.${target.classList[1]}`
      modify(modifyTarget, '.flipForm', index)
    }

    if(state){
      return (
          <div className={'note flipIndex' + index} style={style} data-index={index} data-flip-id="flipform">
              <p>{children}</p>
              <p>{index}</p>
              <span>
                  <button onClick={modifyTarget} className="btn btn-primary glyphicon glyphicon-pencil" />
                  <button onClick={remove} className="btn btn-danger glyphicon glyphicon-trash" />
              </span>
          </div>
      );
    }else{
      return (
          <div className={'note flipIndex' + index + ' dumyNote'} style={style} data-index={index} data-flip-id="flipform">
              <p>{children}</p>
              <p>{index}</p>
              <span>
                  <button onClick={modifyTarget} className="btn btn-primary glyphicon glyphicon-pencil" />
                  <button onClick={remove} className="btn btn-danger glyphicon glyphicon-trash" />
              </span>
          </div>
      );
    }
};
const NoteFlip = ({textsave, flipOut}) => {
  const [noteText, setNoteText] = useState('');
  // useEffect(()=>{
  //   setNoteText()
  // },[])
  const save = (e) => {
    textsave(e,noteText)
    setNoteText('')
  }
  const cancel = () => {
    flipOut()
  }

  return (
    <Container mx='auto' className='flipForm mw-70 p-4 rounded-4 position-fixed bg-warning-subtle' data-flip-id="flipform" style={{ maxWidth:'720px', zIndex:'3000'}}>
      <Stack direction="horizontal">
        <div className='username px-3 mb-3'>작성자</div>
        <div className='date ms-auto px-3 mb-3'>날짜</div>
      </Stack>
      <FloatingLabel className='mb-4' controlId="noteText" label='방명록을 작성해주세요'>
        <FormControl as="textarea" placeholder="Leave a comment here" style={{ height: '300px' }} value={noteText} onChange={(e) => setNoteText(e.target.value)}></FormControl>
      </FloatingLabel>
      <Stack direction='horizontal'>
        <Button className='me-2 ms-auto' onClick={save}>save</Button>
        <Button onClick={cancel}>cancel</Button>
      </Stack>
    </Container>
  )
}


const Board = () => {
  const [notes, setNotes] = useState([]);
  const [id, setId] = useState(0);
  const [FlipArry, setFlip] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notes && notes.length !== 0) {
      setId(notes.slice(-1)[0].id);
    } else {
      setId(0);
    }

    localStorage.setItem('bbs_data_style', JSON.stringify(notes));//테스트용 로컬스토리지 출력
  }, [notes]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://nmwoo.info/backend/backend.php');
      const fetchData = response.data.map((note) => {
        return {
          date: note.date,
          id: note.id,
          ip: note.ip,
          state: Boolean(parseInt(note.state)),
          style: {transform: note.style},
          note: note.text,
          user_data: note.user_data
        };
      });
      setNotes(fetchData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }  
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://nmwoo.info/backend/save_post.php', {
        text: 'textValue',
        style: style(),
        state: false
      });
    } catch (error) {
      console.error('Error saving post:', error);
    }
    fetchData();
  };
  
  const handleUpdate = async (e, newText, i, transform) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://nmwoo.info/backend/update_post.php', {
        text: newText,
        id: i,
        style: transform,
        state: true
      });
    } catch (error) {
      console.error('Error saving post:', error);
    }
    fetchData();
  };

  const bbs_delete = async (id) => {
    try {
      const response = await axios.post('http://nmwoo.info/backend/delete_post.php', {
        id: id
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    fetchData();
  };


  const creatNote = (e) => {
    handleSubmit(e)
    flip('.createBtn','.flipForm')
    setFlip(['.createBtn','.flipForm'])
  }

  const noteSave = (e, noteText) => {
    
    if(FlipArry[0] === '.createBtn'){
      console.log(id)
      const updatedNotes = notes.filter(note => note.id === id);
      const style = updatedNotes[0].style.transform;
      flip('.flipIndex'+(id), FlipArry[1])
      update(e, noteText, id, style)
    }else{
      console.log(FlipArry[2])
      const updatedNotes = notes.filter(note => note.id === FlipArry[2]);
      const style = updatedNotes[0].style.transform;
      flip(FlipArry[0], FlipArry[1])
      update(e, noteText, FlipArry[2], style)
    }
  }

  const update = (e, newText, i, style) => {
    handleUpdate(e, newText, i, style)
  };

  const modify = (from, to, id) => {
    flip(from, to)
    setFlip([from, to, id])
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        return { ...note, state:false};
      }
      return note;
    });
    setNotes(updatedNotes);
  }

  const remove = (i) => {
    bbs_delete(i)
  };
  
  const dragset = (e, transform, i) => {
    const updatedNotes = notes.filter(note => note.id === i);
    const noteText = updatedNotes[0].note;

    update(e, noteText, i, transform)
  }

  const flipOut = () => {
    flip(FlipArry[0], FlipArry[1])
    if(FlipArry[0] === '.createBtn'){
      remove(id)
    }else{
      const updatedNotes = notes.map(note => {
          return { ...note, state:true};
      });
      setNotes(updatedNotes);
    }
  }


    return (
        <div className="board">
            {notes.map((note) => (
                <Note key={note.id} index={note.id} length={id} style={note.style} state={note.state} drag={dragset} modify={modify} onRemove={remove}>
                    {note.note}
                </Note>
            ))}
            <button className="createBtn btn btn-sm btn-success glyphicon glyphicon-plus" data-flip-id="flipform" onClick={creatNote} />
            <NoteFlip textsave={noteSave} flipOut={flipOut}></NoteFlip>
        </div>
    );
};

export default Board;
