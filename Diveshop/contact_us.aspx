<%@ Page language="c#" Codebehind="contact_us.aspx.cs" AutoEventWireup="false" Inherits="merware.contact_us" %>
<%@ Register TagPrefix="diveshop" TagName="header" Src="includes/header.ascx" %>
<%@ Register TagPrefix="diveshop" TagName="footer" Src="includes/footer.ascx" %>

<diveshop:header id=header1 runat="server"></diveshop:header>

<form id="Form1" method="post" runat="server">
	<table align="center">
		<tr>
			<td colspan="2">
				To contact us for more information, 
				please email us at <A href="mailto:info@merware.com">info@merware.com</A>,<br>
				or complete and submit the following form:<BR><BR>
			</td>
		</tr>
		<tr>
			<td align="right">Name:</td>
			<td><asp:TextBox id=txt_name runat="server"></asp:TextBox></td>
		</tr>
		<tr>
			<td align="right">Company:</td>
			<td><asp:TextBox id=txt_company runat="server"></asp:TextBox></td>
		</tr>
		
		<tr>
			<td align="right">Country:</td>
			<td><asp:TextBox id=txt_country runat="server"></asp:TextBox></td>
		</tr>
		<tr>
			<td align="right">Email:</td>
			<td><asp:TextBox id=txt_email runat="server"></asp:TextBox></td>
		</tr>
		<tr>
			<td align="right">Phone #:</td>
			<td><asp:TextBox id=txt_phone runat="server"></asp:TextBox></td>
		</tr>
		<tr>
			<td align="right" valign="top">Comments:</td>
			<td><asp:TextBox id=txt_comments runat="server" TextMode="MultiLine" Columns="40" Rows="5"></asp:TextBox></td>
		</tr>
		<tr>
			<td></td>
			<td><asp:Button id=btn_submit runat="server" Text="Submit"></asp:Button></td>
		</tr>
	</table>
</form>
<diveshop:footer id="footer1" runat="server"></diveshop:footer>
