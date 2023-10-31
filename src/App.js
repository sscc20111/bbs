import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";
import { Flip } from 'gsap/Flip';
import { Button, Container, FloatingLabel, FormControl, Stack } from 'react-bootstrap';

import fetchData , {handleSubmit, bbs_delete} from './backend'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

gsap.registerPlugin(Draggable, Flip) 

const style = () => {
  const randomBetween = (min, max) => {
    return min + Math.ceil(Math.random() * max);
  };
  
  const style = { transform: 'translate(' + randomBetween(0, window.innerWidth - 150) + 'px,' + randomBetween(0, window.innerHeight - 150) + 'px) rotate(' + randomBetween(-15, 15) + 'deg)', };
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

          drag(target.style.transform, index)
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
  const save = () => {
    textsave(noteText)
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
  useEffect(() => {
    fetchData();
  }, []);

  const [notetest, setNotetest] = useState([]);
  const [tests, settest] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://nmwoo.info/backend/backend.php');
      // setNotetest(response.data);
      console.log(response.data);
      const updatedNotes = response.data.map((note) => {
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
      settest(updatedNotes)
    } catch (error) {
      console.error('Error fetching data:', error);
    }  
  };  
  const test = () => {
    // const cleanedData = notes[0].replace(/\\/g, '');
    // const parsedData = JSON.parse(notes[0]);
  
    const updatedNotes = notetest.map((note) => {
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
    settest(updatedNotes)
    localStorage.setItem('bbs_data_style2', JSON.stringify(updatedNotes));
    // localStorage.setItem('bbs_data_style3', JSON.stringify(updatedNotes[1].style.replaceAll("\"", "'")));
    console.log(updatedNotes)
    // console.log(updatedNotes[1].style)
    // console.log(notes)
  }


    const savenotes = JSON.parse(localStorage.getItem('bbs_data_style'));
    const [notes, setNotes] = useState(savenotes || []);
    const [id, setId] = useState(0);
    const [FlipArry, setFlip] = useState([]);
    useEffect(() => {
      if (savenotes && savenotes.length !== 0) {
        setId(savenotes.slice(-1)[0].id + 1);
      } else {
        setId(0);
      }
    }, [savenotes]);

    useEffect(()=>{
      localStorage.setItem('bbs_data_style', JSON.stringify(notes));
    },[notes])
    
    const remove = (i) => {
      const updatedNotes = notes.filter(note => note.id !== i);
      setNotes(updatedNotes);
    };
    
    const dragset = (transform, i) => {
      console.log(transform)
      const Localnotes = JSON.parse(localStorage.getItem('bbs_data_style'));
      const updatedNotes = Localnotes.map(note => {
        if (note.id === parseInt(i)) {
          return { ...note, style:{...note.style, transform:transform} };
        }
        return note;
      });
      setNotes(updatedNotes);
    }

    const flipOut = () => {
      flip(FlipArry[0], FlipArry[1])
      if(FlipArry[0] === '.createBtn'){
        remove(id-1)
        setId(id-1)
      }else{
        const updatedNotes = notes.map(note => {
            return { ...note, state:true};
        });
        setNotes(updatedNotes);
      }
    }


    const update = (newText, i) => {
      const updatedNotes = notes.map(note => {
        if (note.id === i) {
          return { ...note, note:newText, state:true};
        }
        return note;
      });
      setNotes(updatedNotes);
    };

    const noteSave = (noteText) => {
      if(FlipArry[0] === '.createBtn'){
        flip('.flipIndex'+(id-1), FlipArry[1])
        update(noteText, id-1)
      }else{
        flip(FlipArry[0], FlipArry[1])
        update(noteText, FlipArry[2])
      }
    }

    const creatNote = () => {
      setId(id+1)
      setNotes([...notes, { id: id, style: style(), state:false}]);
      flip('.createBtn','.flipForm')
      setFlip(['.createBtn','.flipForm'])
      console.log(notes)

    }

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

    return (
        <div className="board">
            {/* {notes.map((note) => (
                <Note key={note.id} index={note.id} length={id} style={note.style} state={note.state} drag={dragset} modify={modify} onRemove={remove}>
                    {note.note}
                </Note>
            ))} */}
            {tests.map((note) => (
                <Note key={note.id} index={note.id} length={id} style={note.style} state={note.state} drag={dragset} modify={modify} onRemove={remove}>
                    {note.note}
                </Note>
            ))}
            {/* <button className="createBtn btn btn-sm btn-success glyphicon glyphicon-plus" data-flip-id="flipform" onClick={creatNote} /> */}
            <button className="createBtn btn btn-sm btn-success glyphicon glyphicon-plus" data-flip-id="flipform" onClick={test} />
            <NoteFlip textsave={noteSave} flipOut={flipOut}></NoteFlip>
        </div>
    );
};

export default Board;
