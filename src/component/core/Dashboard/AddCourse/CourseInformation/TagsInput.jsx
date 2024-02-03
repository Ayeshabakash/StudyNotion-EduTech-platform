import React , {useState, useEffect} from 'react'
import { MdClose } from "react-icons/md"
import { useSelector } from 'react-redux';

const TagsInput = ({
    label, name , placeholder, register, getValues , setValue , errors}) => {

    const [tags , setTags] = useState([]);

    const { editCourse, course } = useSelector((state) => state.course);

    useEffect(() => {
        if (editCourse) {
          // console.log(course)
          setTags(course.tag);
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
      }, [])
    
      useEffect(() => {
        setValue(name, tags)
      }, [tags])

    
    // a function to handle whenever a user press Enter or , for tags input 
    const onEnterHandler = (event) => {
        // check if user press 'Enter' of ','
        if(event.key === 'Enter' || event.key === ',')
        {
            event.preventDefault();

            const tag = event.target.value.trim();

            // check whether this tag is already present in the state or not 
            if(tag && !tags.includes(tag))
            {
                // create newTags with prev state and new tag
                const newTags = [...tags , tag];
                setTags(newTags);
            }
            // reset the input field 
            event.target.value= "";
        }
    }

    // a function that remove a tag from the state 
    const removeTags = (tag) => {
        //Filter the tags array to remove the tag 
        const newTags = tags.filter( (item) => item !== tag)
        setTags(newTags);
    }
  
    return (
    <div className='flex flex-col gap-y-2'>
        <label htmlFor={name} className='label-style' >{label} <span className='text-pink-200'>*</span></label>
        {/* render the tags if present  */}
        {
            tags.length > 0 && (
                <div className='flex flex-wrap gap-y-2'>
                    {
                        tags.map( (tag , index) => (
                            <div key={index}
                            className='bg-yellow-400 rounded-full px-2 py-1 text-sm text-richblack-5 flex items-center gap-x-2 m-1'>
                                <p>{tag}</p>
                                <MdClose onClick={() => removeTags(tag)} className='ml-2 focus:outline-none cursor-pointer'/> 
                            </div>
                        ))
                    }
                </div>
            )
        }

        <input
            type='text'
            name={name}
            id={name}
            placeholder={placeholder}
            onKeyDown={onEnterHandler}
            className='form-style'
        />
        {
            errors[name] && (
                <span className='ml-2 text-xs text-pink-200 tracking-wide'>Tags is required</span>
            )
        }
    </div>
  )
}

export default TagsInput