// ** Next Import
import Document, { Html,Head,  Main, NextScript } from 'next/document'


class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
        <meta
          name="description"
          content="LUMI"
        />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/apple-touch-icon.png' />
          <link rel='shortcut icon' href='/images/favicon.png' />
        </Head>
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}



export default CustomDocument
