const notValid = () => {
    const html = emailTemplate('Not Found','The page you are looking for was not found.');
    return html;
}

const verifiedUser = () => {
    const html = emailTemplate('Verified!','Congrats! You successfully registered, and can now use Chore!');
    return html;
}

const emailTemplate = (title, text) => {

    const email_title = title;
    const chore_logo_src = 'https://i.imgur.com/9YeCrLD.png';
    const chore_homepage_link = 'http://localhost:3000/';
    const linkedin_img_src = 'http://www.vhtrucks.com/wp-content/uploads/2018/01/linkedin-logo.png';
    const linkedin_link = 'https://www.linkedin.com/in/spencer-hemstreet-094331177/';
    const github_img_src = 'http://pluspng.com/img-png/github-octocat-logo-png-check-me-out-on-github-500.png';
    const chore_github_link = 'https://github.com/sfhemstreet/chore-app';
    const email_text = text;

    const emailTemp = 
    `<!DOCTYPE html PUBLIC "-//W3C//Ddiv XHTML 1.0 divansitional//EN"
        "http://www.w3.org/div/xhtml1/Ddiv/xhtml1-divansitional.ddiv">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>${email_title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0;" bgcolor="#F4F4F4">
    <div align="center"  border="0" >
    <div bgcolor="#357EDD">
        <div align="center">
            <div align="center"  border="0"  width="600"
                style="border-spacing: 2px 5px;"
                bgcolor="#FFFFFF">
                <div>
                    <div align="center" style="padding: 5px 5px 5px 5px;">
                        <a href="${chore_homepage_link}" target="_blank">
                            <img src="${chore_logo_src}" alt="Chore Logo" width="100" />
                        </a>
                    </div>
                </div>
                <div>
                    <div bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                        <div  border="0" cellpadding="0" cellspacing="0" width="100%%">
                            <div>
                                <div style="padding: 10px 0 10px 0; font-family: Avenir, sans-serif; font-size: 16px;">
                                    <!-- Initial text goes here-->
                                    ${email_text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div bgcolor="#96CCFF" style="padding: 15px; display: inline-flex; justify-content: space-around;  ">
                        <div style="padding: 15px;">
                            <a href="${chore_github_link}" target="_blank">
                                <img src="${github_img_src}" alt="Chore Github" width="50" height="50"
                                    style="display: block;"  border="0"/>
                            </a>
                        </div>
                        <div style="padding: 15px;">
                            <a href="${linkedin_link}" target="_blank">
                                <img src="${linkedin_img_src}" alt="Linkedin" width="50" height="50"
                                    style="display: block;"  border="0"/>
                            </a>
                        </div>
                        <div style="padding: 15px;">
                            <a href="${chore_homepage_link}" target="_blank">
                                <img src="${chore_logo_src}" alt="Chore HomePage" width="100" height="50"
                                    style="display: block;"  border="0"/>
                            </a>
                        </div>               
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </body>
    </html>`;

    return emailTemp;
}

module.exports = {
    notValid,
    verifiedUser,
    emailTemplate
}