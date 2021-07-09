<%@ Register TagPrefix="diveshop" TagName="header" Src="includes/header.ascx" %>
<%@ Register TagPrefix="diveshop" TagName="footer" Src="includes/footer.ascx" %>
<%@ Page language="c#" Codebehind="Default.aspx.cs" AutoEventWireup="false" Inherits="merware.diveshop._Default" %>


<diveshop:header id=header1 runat="server"></diveshop:header>
<form id=Form1 method=post runat="server">
<table width="90%" align=center>
  <tr>
    <td><IMG height=25 src="../images/spacer.gif" width=1 > </TD></TR>
  <tr>
    <td>
      <p>
      <h3>Welcome to MerWare.com, the home of DiveShop.net. 
      </H3>DiveShop.net is software from MerWare, <A href="powered_by.aspx" >built from the ground 
      up</A> for the dive operator.&nbsp; It organizes the business below the 
      bubbles, freeing you from the administrative details of your services, 
      allowing you to focus on pleasing your customers with safe and fun dive 
      excursions.
      <P></P>
      <p>For more information, please <A href="contact_us.aspx" >contact us</A>. <br 
      ><br>
      <table>
        <tr><td><a href="http://www.dema.org"><img src="../images/dema.gif" height=129 width=140 border=0></a></td>
	<td>MerWare exhibited at DEMA 2002 in <a href="http://www.oceanfrontiers.com">Ocean Frontiers</a>' 
	Booth. And Ocean Frontiers is still
	<a href="http://captainsblogcayman.blogspot.com/2005/09/big-40-and-what-picture.html">
	using the system in production, to manage the little details</a> which help 
	delight their customers.</td>
</TR></TABLE></P></TD></TR>
  <tr>
    <td><IMG height=75 src="../spacer.gif" width=1 > 
</td></tr></TABLE></FORM>
<diveshop:footer id=footer1 runat="server"></diveshop:footer>
