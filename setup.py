#!/usr/bin/env python
# -*- coding: utf-8; -*-
#
# This file is part of Superdesk.
#
# Copyright 2019 Sourcefabric z.u. and contributors.
#
# For the full copyright and license information, please see the
# AUTHORS and LICENSE files distributed with this source code, or
# at https://www.sourcefabric.org/superdesk/license

from setuptools import setup, find_packages

setup(
    name='superdesk-publisher',
    version='2.1',
    description='Superdesk Publisher plugin',
    author='sourcefabric',
    author_email='contact@sourcefabric.org',
    url='https://github.com/superdesk/superdesk-publisher',
    license='GPLv3',
    platforms=['any'],
    package_dir={'': 'server'},
    packages=find_packages('server'),
    install_requires=[],
)
