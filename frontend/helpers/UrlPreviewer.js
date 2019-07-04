import * as React from 'react';
import styles from "../containers/Message/Message.scss";

const cheerio = require('cheerio-without-node-native');
const urlObj = require('url');
const fetch = require('cross-fetch').fetch;
require('es6-promise').polyfill();

const CONSTANTS = require('./constants');

export class UrlPreviewerCard extends React.Component {
  static defaultProps = {
    header: null,
    description: null,
    url: null,
    file: null,
    proxyUrl: 'https://cors-anywhere.herokuapp.com',
  };

  constructor(props: any) {
    super(props);

    this.state = {
      data: {
        title: null,
        description: null,
        images: [],
        type: null,
        videos: [],
        url: null,
        file: null,
        mediaType: null,
        contentType: null,
        favicons: []
      },
      loading: true
    };
  }

  componentDidMount() {
    const message = this.props.url;
    const file = this.props.file;
    const httpsRegex = /(https?:\/\/[^ ]*)/;
    const httpRegex = /(http?:\/\/[^ ]*)/;
    const wwwRegex = /(www[^ ]*)/;

    let url = null;

    if (message != null) {
      if (message.match(httpsRegex)) {
        url = message.match(httpsRegex)[1];
      } else if (message.match(httpRegex)) {
        url = message.match(httpRegex)[1];
      } else if (message.match(wwwRegex)) {
        url = message.match(wwwRegex)[1];
      }
      if (url && !file) {
        fetch(this.props.proxyUrl ? `${this.props.proxyUrl}/` + url : url, {}).then((response) => {
          this.getPreview(response);
        }).catch((err: any) => {
          console.error(err);
          this.setState({
            data: {
              title: url.substring(url.lastIndexOf('/') + 1),
              description: url.substring(url.lastIndexOf('/') + 1),
              images: [],
              url: url,
              videos: [],
              type: "image",
              mediaType: null,
              file: file,
              contentType: null,
              favicons: []
            }, loading: false
          })
        });
      }
    } else if (file != null) {
      this.setState({
        data: {
          images: [file],
          url: file,
          file: file
        }
      });
    }
  }

  render() {
    return (<a href={this.state.data ? this.state.data.url : ''} className={styles.messagePreview}>
        <div className={styles.imgStyle}><img alt={this.state.data ? this.state.data.title : ''}
                                              width={this.state.data && this.state.data.file ? '500px' : '100px'}
                                              src={this.state.data && this.state.data.images ? this.state.data.images[0] : ''}/>
        </div>
        <div className={styles.detailsStyle} title={this.state.data ? this.state.data.title : ''}>
          <div className={styles.previewTitle}>{this.state.data ? this.state.data.title : ''}</div>
          <div>{this.state.data ? this.state.data.description : ''}</div>
        </div>
      </a>
    );
  }

  getPreview(response, options) {

    // get final URL (after any redirects)
    const finalUrl = response.url;

    // get content type of response
    let contentType = response.headers.get('content-type');

    if (!contentType) {
      return reject({error: 'React-Native-Link-Preview: Could not extract content type for URL.'});
    }
    if (contentType instanceof Array) {
      contentType = contentType[0];
    }

    // parse response depending on content type
    if (contentType && CONSTANTS.REGEX_CONTENT_TYPE_IMAGE.test(contentType)) {
      return this.parseImageResponse(finalUrl, contentType);
    } else if (contentType && CONSTANTS.REGEX_CONTENT_TYPE_AUDIO.test(contentType)) {
      return this.parseAudioResponse(finalUrl, contentType);
    } else if (contentType && CONSTANTS.REGEX_CONTENT_TYPE_VIDEO.test(contentType)) {
      return this.parseVideoResponse(finalUrl, contentType);
    } else if (contentType && CONSTANTS.REGEX_CONTENT_TYPE_TEXT.test(contentType)) {
      let self = this;
      response.text()
        .then(function (text) {
          return self.parseTextResponse(text, finalUrl, options || {}, contentType);
        });
    } else if (contentType && CONSTANTS.REGEX_CONTENT_TYPE_APPLICATION.test(contentType)) {
      return this.parseApplicationResponse(finalUrl, contentType);
    } else {
      return {error: 'React-Native-Link-Preview: Unknown content type for URL.'};
    }
  }

  parseImageResponse(url, contentType) {
    this.setState({
      data: {
        url: url,
        mediaType: 'image',
        contentType: contentType,
        favicons: [this.getDefaultFavicon(url)]
      },
      loading: false
    });
  }

  parseAudioResponse(url, contentType) {
    this.setState({
      data: {
        url: url,
        mediaType: 'audio',
        contentType: contentType,
        favicons: [this.getDefaultFavicon(url)]
      },
      loading: false
    });
  }

  parseVideoResponse(url, contentType) {
    this.setState({
      data: {
        url: url,
        mediaType: 'video',
        contentType: contentType,
        favicons: [this.getDefaultFavicon(url)]
      },
      loading: false
    });
  }

  parseApplicationResponse(url, contentType) {
    this.setState({
      data: {
        url: url,
        mediaType: 'application',
        contentType: contentType,
        favicons: [this.getDefaultFavicon(url)]
      },
      loading: false
    });
  }

  parseTextResponse(body, url, options, contentType) {
    const doc = cheerio.load(body);

    this.setState({
      data: {
        url: url,
        title: this.getTitle(doc),
        description: this.getDescription(doc),
        mediaType: this.getMediaType(doc) || 'website',
        contentType: contentType,
        images: this.getImages(doc, url, options.imagesPropertyType),
        videos: this.getVideos(doc),
        favicons: this.getFavicons(doc, url)
      },
      loading: false
    });
  }

  getTitle(doc) {
    let title = doc("meta[property='og:title']").attr('content');

    if (!title) {
      title = doc('title').text();
    }

    return title;
  }

  getDescription(doc) {
    let description = doc('meta[name=description]').attr('content');

    if (description === undefined) {
      description = doc('meta[name=Description]').attr('content');
    }

    if (description === undefined) {
      description = doc("meta[property='og:description']").attr('content');
    }

    return description;
  }

  getMediaType(doc) {
    const node = doc('meta[name=medium]');

    if (node.length) {
      const content = node.attr('content');
      return content === 'image' ? 'photo' : content;
    } else {
      return doc("meta[property='og:type']").attr('content');
    }
  }

  getImages(doc, rootUrl, imagesPropertyType) {
    let images = [],
      nodes,
      src,
      dic;

    let imagePropertyType = imagesPropertyType || 'og';
    nodes = doc('meta[property=\'' + imagePropertyType + ':image\']');

    if (nodes.length) {
      nodes.each(function (index, node) {
        src = node.attribs.content;
        if (src) {
          src = urlObj.resolve(rootUrl, src);
          images.push(src);
        }
      });
    }

    if (images.length <= 0 && !imagesPropertyType) {
      src = doc('link[rel=image_src]').attr('href');
      if (src) {
        src = urlObj.resolve(rootUrl, src);
        images = [src];
      } else {
        nodes = doc('img');

        if (nodes.length) {
          dic = {};
          images = [];
          nodes.each(function (index, node) {
            src = node.attribs.src;
            if (src && !dic[src]) {
              dic[src] = 1;
              // width = node.attribs.width;
              // height = node.attribs.height;
              images.push(urlObj.resolve(rootUrl, src));
            }
          });
        }
      }
    }

    return images;
  }

  getVideos(doc) {
    const videos = [];
    let nodeTypes;
    let nodeSecureUrls;
    let nodeType;
    let nodeSecureUrl;
    let video;
    let videoType;
    let videoSecureUrl;
    let width;
    let height;
    let videoObj;
    let index;

    const nodes = doc("meta[property='og:video']");
    const length = nodes.length;

    if (length) {
      nodeTypes = doc("meta[property='og:video:type']");
      nodeSecureUrls = doc("meta[property='og:video:secure_url']");
      width = doc("meta[property='og:video:width']").attr('content');
      height = doc("meta[property='og:video:height']").attr('content');

      for (index = 0; index < length; index++) {
        video = nodes[index].attribs.content;

        nodeType = nodeTypes[index];
        videoType = nodeType ? nodeType.attribs.content : null;

        nodeSecureUrl = nodeSecureUrls[index];
        videoSecureUrl = nodeSecureUrl ? nodeSecureUrl.attribs.content : null;

        videoObj = {
          url: video,
          secureUrl: videoSecureUrl,
          type: videoType,
          width: width,
          height: height
        };
        if (videoType && videoType.indexOf('video/') === 0) {
          videos.splice(0, 0, videoObj);
        } else {
          videos.push(videoObj);
        }
      }
    }

    return videos;
  }

// returns an array of URL's to favicon images
  getFavicons(doc, rootUrl) {
    let images = [],
      nodes = [],
      src;

    const relSelectors = ['rel=icon', 'rel="shortcut icon"', 'rel=apple-touch-icon'];

    relSelectors.forEach(function (relSelector) {
      // look for all icon tags
      nodes = doc('link[' + relSelector + ']');

      // collect all images from icon tags
      if (nodes.length) {
        nodes.each(function (index, node) {
          src = node.attribs.href;
          if (src) {
            src = urlObj.resolve(rootUrl, src);
            images.push(src);
          }
        });
      }
    });

    // if no icon images, use default favicon location
    if (images.length <= 0) {
      images.push(this.getDefaultFavicon(rootUrl));
    }

    return images;
  }

// returns default favicon (//hostname/favicon.ico) for a url
  getDefaultFavicon(rootUrl) {
    return urlObj.resolve(rootUrl, '/favicon.ico');
  }
}
