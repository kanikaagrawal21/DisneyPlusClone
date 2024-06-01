import styled from "styled-components";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import userSlice, { selectUserEmail, selectUserName, selectUserPhoto } from "../store/reducers/userSlice";
import { Link } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
function Header(props) {

  const dispatch = useDispatch();
  const history = useHistory();
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);
  const userPhoto = useSelector(selectUserPhoto);

  const setUser = (user) => {
    dispatch(userSlice.actions.setUserLoginDetails(
      {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }
    ))
  }

  const handleAuth = () => {
    if (!userName) {
      signInWithPopup(auth, provider).then((result) => {
        setUser(result.user);
      }).catch(err => {
        alert(err);
      });
    } else if (userName) {
      signOut(auth).then(() => {
        dispatch(userSlice.actions.setSignOutState());
        history.push('/');
      }).catch(err => {
        alert(err.message);
      })
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await setUser(user);
        history.push('/home');
      }
    })
  }, [userName])

  return (
    <Nav>
        <Logo>
            <img src="/images/logo.svg" alt="" />
        </Logo>
        { 
          !userName ? <Login onClick={handleAuth}>Login</Login> :
          <>
            <NavMenu>
              <Link to="/home">
                <img src="/images/home-icon.svg" alt="" />
                <span>HOME</span>
              </Link>
              <Link to="/search">
                <img src="/images/search-icon.svg" alt="" />
                <span>SEARCH</span>
              </Link>
              <Link to="/watchlist">
                <img src="/images/watchlist-icon.svg" alt="" />
                <span>WATCHLIST</span>
              </Link>
              <Link to="/originals">
                <img src="/images/original-icon.svg" alt="" />
                <span>ORIGINALS</span>
              </Link>
              <Link to="/movies">
                <img src="/images/movie-icon.svg" alt="" />
                <span>MOVIES</span>
              </Link>
              <Link to="/series">
                <img src="/images/series-icon.svg" alt="" />
                <span>SERIES</span>
              </Link>          
            </NavMenu>

            <SignOut>
              <UserImg src={userPhoto} alt={userName} />
              <DropDown>
                <span onClick={handleAuth}>Sign out</span>  
              </DropDown>  
            </SignOut>          
          </>
        }
    </Nav>
  );
}

const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: #090b13;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 36px;
    z-index: 3;
`;

const Logo = styled.a`
    padding: 0;
    width: 80px;
    margin-top: 4px;
    max-height: 70px;
    font-size: 0;
    display: inline-block;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
    }
`;

const NavMenu = styled.div`
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
    position: relative;
    margin-right: auto;
    margin-left: 25px;

    a {
        display: flex;
        align-items: center;
        padding: 0 12px;

      img {
          height: 20px;
          min-width: 20px;
          width: 20px;
          z-index: auto;
      }

      span {
          color: rgb(249,249,249);
          font-size: 13px;
          letter-spacing: 1.42px;
          line-height: 1.08;
          white-space: nowrap;
          position: relative;

        &:before {
            background-color: rgb( 249, 249, 249);
            border-radius: 0 0 4px 4px;
            bottom: -6px;
            content: "";
            height: 2px;
            left: 0px;
            opacity: 0;
            position: absolute;
            right: 0px;
            transform-origin: left center;
            transform: scaleX(0);
            transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
            visibility: hidden;
            width: auto;
        }

      }

      &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
      

}
    @media (max-width: 920px) {
      display: none;
    }

`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

const UserImg = styled.img`
  height: 100%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0 0 18px 0;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  ${UserImg} {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
  
  &:hover {
    ${DropDown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

export default Header;