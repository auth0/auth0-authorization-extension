import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import uuid from 'node-uuid';
import './APIExplorerTab.styl';

export default class APIExplorer extends Component {
  static propTypes = {
    explorer: PropTypes.object.isRequired
  }

  isGUID(param, definition) {
    if (definition && definition.items &&
      definition.items['x-format'] && definition.items['x-format'][param]) {
      return true;
    }

    return false;
  }

  renderRow(name, type, lastElement, key, path, parameter, definitions) {
    const extra = !lastElement ? (<span>,<br /></span>) : null;

    if (type === 'array' || type === 'object') {
      return (
        <span key={key} className="prop">{name}: {this.renderRoutesBody(path, parameter, name, definitions, name)}{extra}</span>
      );
    }

    return (
      <span key={key} className="prop">{name}: {this.renderType(name, type)}{extra}</span>
    );
  }

  renderType(name, type) {
    if (name === 'guid') {
      return `"${uuid.v4()}"`;
    } else if (type === 'string') {
      return `"My ${name}"`;
    } else if (type === 'integer') {
      return '0123';
    }

    return type;
  }

  renderObject(definition, path, definitions) {
    return (
      <span>
        {'{'}
        <br />
        {
          _.map(Object.keys(definition.properties), (prop, idx, array) => {
            return this.renderRow(
              prop,
              definition.properties[prop].type, idx === array.length - 1,
              `${path}-${prop}-${idx}`,
              path,
              definition.properties,
              definitions);
          })
        }
        <br />
        {'}'}
      </span>
    );
  }

  renderItemsArray(definition, path, definitions, parentName) {
    return (
      <span>
        {'['}
        <br />
        { this.renderRoutesBody(path, definition, 'items', definitions, parentName) }
        <br />
        {']'}
      </span>
    );
  }

  renderSimpleArray(definition, path, parentName) {
    return (
      <span>
        {'['}
        { this.isGUID('guid', definition) ?
          this.renderType('guid', definition.items.type) :
          parentName ?
          this.renderType(parentName.slice(0, -1), definition.items.type) :
          path.indexOf('/members') > 0 ?
          this.renderType('member', definition.items.type) :
          this.renderType('value', definition.items.type)
        }
        {']'}
      </span>
    );
  }

  renderRoutesBody = (path, parameter, refParent, definitions, parentName) => {
    if (!path || !parameter || !refParent || !definitions ||
    !parameter[refParent] || !parameter[refParent]['$ref']) {
      return null;
    }

    const ref = parameter[refParent]['$ref'].split('/');
    const def = ref[ref.length - 1];
    const definition = definitions[def];

    if (definition && definition.properties) {
      // object
      return this.renderObject(definition, path, definitions);
    } else if (definition.items && definition.items['$ref']) {
      // array with objects
      return this.renderItemsArray(definition, path, definitions, parentName);
    } else if (definition.items) {
      // simple array
      return this.renderSimpleArray(definition, path, parentName);
    }
  }

  renderPath(path) {
    // replace ids by uuid.v4()
    return path.replace('{id}', uuid.v4())
        .replace('{clientId}', uuid.v4())
        .replace('{userId}', uuid.v4());
  }

  renderEndpoints(paths, definitions) {
    const keys = Object.keys(paths);
    return (
      <div>
        {
        _.map(_.sortBy(keys), (path) => {
          const routes = Object.keys(paths[path]);
          return (
            <div key={path}>
              {_.map(routes, route => {
                return (
                  <div key={`${path}-${route}`}>
                    <code className="prettyprint">{route.toUpperCase()} {this.renderPath(path)}</code> <span className="route-description">{paths[path][route].summary}</span>
                    {
                      _.map(paths[path][route].parameters, (parameter, idx) => {
                        if (!parameter.schema) {
                          // query params
                          return null;
                        } else {
                          // body
                          if (parameter.schema['$ref']) {
                            return (
                              <pre key={`${path}-${route}-${idx}`}>
                                { this.renderRoutesBody(path, parameter, 'schema', definitions, null) }
                              </pre>
                            );
                          }
                          return (<p>'Ref Not Found'</p>);
                        }
                      })
                    }
                    <hr />
                  </div>
                );
              })}
            </div>
          );
        })
        }
      </div>
    );
  }

  render() {
    const explorer = this.props.explorer;
    if (!explorer || !explorer.paths) {
      return null;
    }

    return (
      <div>
        { this.renderEndpoints(explorer.paths, explorer.definitions) }
      </div>
    );
  }
}
