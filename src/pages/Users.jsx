import React, { useState, useEffect } from 'react';
import "../components/PixelGrid/PixelGrid.css";
import SummaryApi from '../common';
import axios from "../api/axios";
//************************************************************************************/

const Users = ({ rows, cols }) => {
  //const localStorageKey = 'pixelGridImages';
  // Load grid from local storage or initialize it

  const fixedCols = 95; // Number of columns    77
  const fixedRows = 75; // Number of rows       65  => 5005
  const [pixelSize, setPixelSize] = useState(0);
  const initialGrid = //JSON.parse(localStorage.getItem(localStorageKey)) || 
                      Array(fixedRows * fixedCols).fill({ color: '#ccc', image: null });
  const [grid, setGrid] = useState(initialGrid);
  const [loading, setLoading] = useState(true); // State to show loading status
//************************************************************************************/  
  useEffect(() => {
    const calculatePixelSize = () => {
      const screenWidth = window.innerWidth-45;
      const screenHeight = window.innerHeight-45;
      //console.log("screenWidth=====",screenWidth);
      //console.log("screenHeight=====",screenHeight);

      const calculatedPixelWidth = Math.floor(screenWidth / fixedCols);
      const calculatedPixelHeight = Math.floor(screenHeight / fixedRows);

      const size = Math.min(calculatedPixelWidth, calculatedPixelHeight);
      //console.log("Size=====",size);
      setPixelSize(size);

      /*const newGrid = Array(fixedCols * fixedRows).fill({ color: '#ccc', image: null });
      setGrid(newGrid);*/
    };

    calculatePixelSize();
    window.addEventListener('resize', calculatePixelSize);

    return () => window.removeEventListener('resize', calculatePixelSize);
  }, [fixedCols, fixedRows]);

  //************************************************************************************/

  const transferPixelsToBackend = async () => {
    // Step 1: Retrieve data from localStorage
    const pixelData = localStorage.getItem(localStorageKey);
  
    if (!pixelData) {
      console.error('No pixel data found in localStorage');
      return;
    }
  
    // Step 2: Prepare the data (e.g., JSON.stringify it if it's not already a string)
    const dataToSend = {
      pixels: JSON.parse(pixelData), // Parse the stringified pixel data
    };
    console.log("dataToSend =>  ",dataToSend); // pixels: Array(7125) / [0 … 99] 0: color: "#ccc" image:
    console.log("dataToSend.pixels.Array(7125) =>  ",dataToSend.pixels[0].color);
  
    // Step 3: Send the data to the backend using fetch
    try {
      const response = await fetch(SummaryApi.add_partial_img.url, { //'https://demo1.art-feat.com/api/add/partial/img'
        method: SummaryApi.add_partial_img.method, // POST request to send data
        headers: {
          'Content-Type': 'application/json', // Set headers for JSON data
        },
        //body: JSON.stringify(dataToSend), // Send data as JSON string
        body: JSON.stringify({
          pixel: 3,
          partial_img: dataToSend.pixels[3].image,
        }), // Send data as JSON string
        
      });
  
      // Handle the response
      if (!response.ok) {
        throw new Error('Failed to send pixel data');
      }
  
      const result = await response.json();
      console.log('Pixel data successfully sent:', result);
    } catch (error) {
      console.error('Error sending pixel data:', error);
    }
  };
  
  // Call this function when you want to send the data (e.g., on button click or submit)

//************************************************************************************/
  // Function to convert API response to flat array with pixel number as index
  const convertAPIResponseToIndexedArray = (apiResponse, defaultColor = "#ccc", gridSize = 7125) => {
    // Initialize a flat array with default pixel objects
    const flatArray = Array.from({ length: gridSize }, () => ({
        image: null,  // Default image as null
        color: defaultColor,          // Default color for all pixels
    }));
  
    // Loop through each pixel object in the API response
    apiResponse?.forEach((pixelObj) => {
      const pixelData = Object.values(pixelObj)[0]; // Extract pixel data object
      const pixelIndex = parseInt(pixelData.pixel_number, 10); // Convert pixel_number to index
  
      // Place the pixel data at the corresponding index in the flat array
      flatArray[pixelIndex] = {
        image: pixelData.img || null,  // Use image from API or null if not provided
        status : "Approved",
        email: pixelData.email,
        phone: pixelData.phone,
        country: pixelData.country,
        link: pixelData.link,
        description: pixelData.description || null,
        unit: pixelData.unit,
        color: defaultColor,          // Default color (or modify if necessary)
        type: pixelData.type,
        partial_img: pixelData.partial_img || null
      };
    });
  
    return flatArray; // Return the flat array with pixels indexed by pixel_number
  };
    
  /***************************************************************************************** */
  const sendPixelData = async (index, file) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append("pixel", index);         // Append pixel number
      formData.append("partial_img", file);    // Append the file (image)
  
      // Make the request using axios
      const responseRequest = await axios.post(
        "api/add/partial/img",    // The API endpoint
        formData,                 // The formData object with your data
        {
          headers: {
            "Content-Type": "multipart/form-data",   // Required header for file uploads
            //Authorization: `Bearer ${yourToken}`,    // If you need to include an auth token
          },
        }
      );
  
      console.log("Success:", responseRequest.data); // message: "pixel number is not stored in the database"
      window.location.reload(); // Refresh the page
    //window.location.href = "/";
    } catch (error) {
      console.error("Error uploading pixel data:", error.response?.data || error.message);
    }
  };
  
/*****************************************************************************************/
  const handlePixelClick = (index) => {
    try {
    console.log('Selected pixel index:', index); // Log the index of the selected pixel
    // const newGrid = [...grid];
    // newGrid[index] = {
    //   ...newGrid[index],
    //   color: newGrid[index].color === '#ccc' ? '#000' : '#ccc' // Toggle color
    // };
    // setGrid(newGrid);
    
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {    
          const newGrid = [...grid];
          newGrid[index] = {
            ...newGrid[index],
            image: reader.result, // Store the image data URL
            //image: newGrid[index].image === '#ccc' ? '#000' : reader.result // Toggle color
            //name:"nimer",
          };
          setGrid(newGrid);          
          sendPixelData(index, file);
        };
        reader.readAsDataURL(file); // Read the file as a data URL
        console.log("file", file);
      }
    };
    input.click(); // Trigger the file input dialog    
  } catch (error) {
    console.error('Error:', error);
  }
  };

  //************************************************************************************/

  const handlePixelColorClick = (index) => {
    console.log('Selected pixel index:', index); // Log the index of the selected pixel
    const newGrid = [...grid];
    newGrid[index] = {
      ...newGrid[index],
      color: newGrid[index].color === '#ff0' ? '#00BF00' : newGrid[index].color === '#00BF00'? '#ff0' : "#ccc" // Toggle color
    };
    setGrid(newGrid);
  };

  //************************************************************************************/

  const handlePixelReset = (index) => {
    //splice(2, 1) means remove 1 element at index 2
    const newGrid = [...grid];
    //newGrid.splice(index, 1); // Remove 1 element at index =>> catastrophic
    newGrid[index] = { ...newGrid[index], image: null, country: null, color: "#ccc", name: null, date: null,
      description: null, email:null, mobile:null, url:null, width: null, height: null};
    //newGrid[index] = { ...newGrid[index], };
    setGrid(newGrid);
  };
//************************************************************************************/

  const handleResetAll = () => {
    const newGrid = grid.map(pixel => ({ ...pixel, image: null }));
    setGrid(newGrid);
  };
//************************************************************************************/

  useEffect(() => {
    //localStorage.setItem(localStorageKey, JSON.stringify(grid));
    //transferPixelsToBackend();

    const fetchPixelData = async () => {
      try {
        /*const response = await axios.get('api/approved/pixels', {
          headers: {
            'Content-Type': 'application/json', // Define the expected response type
          },
        });*/

        const response = await fetch('https://pixelsback.localproductsnetwork.com/api/all/pixels', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Define the expected response type
          },
        });
  
        // Step 2: Check if response is okay
        if (!response.ok) {
          throw new Error('Failed to fetch pixel data');
        }
        const data = await response.json();
  
        // Step 3: Set pixel data or initialize if no data is returned
        if (data && data.length > 0) {
          //console.log("data.pixels ",data[0]['1545'].img);
         const localStorageData = convertAPIResponseToIndexedArray(data);
         const approvedGrid = localStorageData || Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
          //console.log(approvedGrid);
  
          setGrid(localStorageData); // Use the fetched pixel data
          //setGridTemp(localStorageData); // Use the fetched pixel data
          console.log("data.pixels ",localStorageData); //
        } else {
          // Initialize a new grid with default values if no data is found
          //const newGrid = initializeGrid(10, 10); // For example, 10x10 grid
          const newGrid = Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null }); // For example, 10x10 grid
          setGrid(newGrid);
          //setGridTemp(newGrid);
          //console.log("data ",data[1].data); //
        }
  
        setLoading(false); // Data loaded
      } catch (error) {
        console.error('Error fetching pixel data:', error);
  
        // If error occurs, initialize a new grid
        const newGrid = Array(fixedRows * fixedCols).fill({ color: "#ccc", image: null });
        setGrid(newGrid);
        //setGridTemp (newGrid);
        //console.error('Error fetching pixel data:',JSON.parse(localStorage.getItem(localStorageKey)));
  
        setLoading(false); // Data loaded
      }
    };
  
    fetchPixelData();

  }, []); //grid

  if (loading) {
    return <div className="flex items-center justify-center">جاري تحميل المربعات &#128512; ...</div>;
  }
  /**
   * color: "#ccc"
country: "قطر"
description: "Desc"
email: "lara@gmail.com"
image: "2024.08.21_اهل غزة في مصر.jpg"
link: "jobs.ps"
partial_img: null
phone: "0599857842"
status: "Approved"
type: "special"
unit: "8ad9266d-0212-486d-b689-3e635ad54c33"
   */
//************************************************************************************/
  return (
    <div>
      <div
        //className="grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${fixedCols}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${fixedRows}, ${pixelSize}px)`,
          width: `${fixedCols * pixelSize}px`,
          height: `${fixedRows * pixelSize}px`,
          margin: 'auto',
        }}
      >
        {grid.map((pixel, index) => (
          <div
            key={index}
            className="pixel"
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: pixel.partial_img ? 'transparent' : pixel.type,
              backgroundImage: pixel.image ? `url(https://pixelsback.localproductsnetwork.com/public/PartialImages/${pixel.partial_img})` : "none",
              backgroundSize: pixel.backgroundSize || 'cover',
              backgroundPosition: pixel.backgroundPosition || 'center',
              transition: 'background-size 0.3s ease, background-position 0.3s ease',
            }}
            title={`مربع ${index}`} // Add the tooltip text here
            //onClick={() => pixel.image && handleImageClick(pixel.image)} // Open image on click
            onClick={() => handlePixelColorClick(index)} // Open image on click
            onDoubleClick={() => handlePixelClick(index)} // Upload image on double-click
            onContextMenu={(e) => {
              e.preventDefault();
              handlePixelReset(index);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Users;
