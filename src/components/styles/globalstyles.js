import { createGlobalStyle } from "styled-components";
import { variables } from "./variables";
import "slick-carousel/slick/slick-theme.css";

export const GlobalStyles =  createGlobalStyle`
  body {
    font-size: 12px;
    font-weight: 400;
    margin: 0;
    background:${variables.color.Maincolor}
  }

  * {
    box-sizing: border-box;
    font-family: 'Bai Jamjuree', sans-ser;
      &::before, &::after {
      box-sizing: border-box;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }


  p {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    text-transform: none;
    color: inherit;
    transition: .3s linear;
    cursor: pointer;
  }

  button {
    background: none;
    border: none;
    outline: none;
  }

  input {
    outline: none;
    margin: 0;
		border: 0;
    /* Chrome, Safari, Edge, Opera */

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */

    &[type=number] {
      -moz-appearance: textfield;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
      transition: background-color 5000s ease-in-out 0s;
    }
  }

	ul, ol {
		list-style: none;
    margin: 0;
		padding: 0;
	}
	
  textarea {
    outline: none;
  }

main {
  margin-bottom: auto;
}

.slick-dots > li > button:before {
  
  font-size: 8px;
  color: #c4c4c4;
  opacity: 1;
}

.slick-dots li.slick-active button:before {
  
  font-size: 10px;
  color: #FFD700;
} 

.celebrity__slide .slick-list {
  height: 330px !important
}

.celebrity__slide .slick-dots {
  bottom: 15px;
}

.percentage__destruction ul {
  display: flex !important;
  padding-left: 1px;
  margin-top: 35px;
}


.percentage__destruction .slick-dots {
  display: block !important; 
  bottom: 15px;

  @media (min-width: 768px) {
    bottom: 0;

  }

  @media (min-width: 1200px) {
    bottom: 0;
  }
  
} 

.percentage__destruction {
  height: 550px
}


`