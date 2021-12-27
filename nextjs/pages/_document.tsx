import React from 'react';
import Document, { DocumentContext } from 'next/document';
import { CssBaseline } from '@geist-ui/react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    };
  }
}

export default MyDocument;
