<%@ Page language="c#" Codebehind="powered_by.aspx.cs" AutoEventWireup="false" Inherits="merware.diveshop.powered_by" %>
<%@ Register TagPrefix="diveshop" TagName="footer" Src="includes/footer.ascx" %>
<%@ Register TagPrefix="diveshop" TagName="header" Src="includes/header.ascx" %>

<diveshop:header id=header1 runat="server"></diveshop:header>
<form id=Form1 method=post runat="server">
<table align=center width="90%">
	<tr>
		<td colspan="2">
			DiveShop.net is architected on and with state-of-the-art Microsoft .NET 
			technology and tools including:
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<IMG height=25 src="../spacer.gif" width=1 > 
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://www.microsoft.com/net/"><img border="0" src="../images\microsoft_net.gif" width="104" height="57"></a>
		</td>
		<td>
			<ul>
				 <li>IIS &amp; ASP.NET 
 
				  <li>SQL Server 
 
				 <li>Visual Studio.NET and C#, and 
	
				 <li>the Microsoft .NET framework and CLR (common language runtime).</li>
			</ul>
		</td>
    </tr>
	<tr>
		<td colspan="2">
			<IMG height=200 src="../spacer.gif" width=1 > 
		</td>
	</tr>
</table>
</form>
<diveshop:footer id=footer1 runat="server"></diveshop:footer>
