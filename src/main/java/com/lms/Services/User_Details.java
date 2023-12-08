package com.lms.Services;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.lms.Entities.User;




public class User_Details implements UserDetails {
	private static final long serialVersionUID = -5584720112233431845L;
	
	private User user;

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUser_name();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}


	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public User getUser() {
		return user;
	}

	public Integer getUserId() {
		return user.getId();
	}


	public void setUser(User user) {
		this.user = user;
	}

	@Override
	public boolean equals(Object otherUser) {
	    if(otherUser == null) return false;
	    else if (!(otherUser instanceof UserDetails)) return false;
	    else return (otherUser.hashCode() == hashCode());
	}

	@Override
	public int hashCode() {
	    return user.getUser_name().hashCode() ;
	}

    @Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_"+role.getRole()))
				.collect(Collectors.toList());
	}

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

}
